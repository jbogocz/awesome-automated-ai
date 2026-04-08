#!/usr/bin/env python3
"""Add tags to projects.yaml from repo-topics.txt"""
import re
import sys

topics_file = 'data/repo-topics.txt'
projects_file = 'projects.yaml'

# Parse topics file
# Format: owner/repo: [tag1, tag2, ...]
topics_map = {}
with open(topics_file) as f:
    for line in f:
        line = line.rstrip('\n')
        m = re.match(r'^(.+?): \[([^\]]*)\]$', line)
        if m:
            repo = m.group(1).strip()
            tags_str = m.group(2).strip()
            if tags_str:
                topics_map[repo] = tags_str

print(f'Loaded topics for {len(topics_map)} repos with non-empty tags', file=sys.stderr)

# Read projects.yaml
with open(projects_file) as f:
    content = f.read()

lines = content.split('\n')

def get_indent(line):
    """Return number of leading spaces."""
    return len(line) - len(line.lstrip(' '))

def is_continuation_line(line, field_indent):
    """A continuation line is indented MORE than the field and doesn't start a new key."""
    stripped = line.lstrip(' ')
    if not stripped:
        return False
    ind = get_indent(line)
    # Continuation: indented more than the field, and not a YAML key (key: value)
    return ind > field_indent and not re.match(r'\w[\w-]*\s*:', stripped)

# Build pending insertions: {line_index_to_insert_after: tags_line}
pending = {}

i = 0
while i < len(lines):
    line = lines[i]
    repo_match = re.match(r'^(\s+)repo:\s+(\S+)\s*$', line)
    if repo_match:
        indent = repo_match.group(1)
        field_indent = len(indent)
        repo = repo_match.group(2)
        tags_str = topics_map.get(repo)

        if tags_str is not None:
            # Find description and note lines for this entry
            # Note: a field may span multiple lines (continuation lines)
            desc_end_idx = None  # last line of description field
            note_end_idx = None  # last line of note field
            already_has_tags = False

            j = i + 1
            while j < min(i + 20, len(lines)):
                l = lines[j]
                stripped = l.lstrip(' ')
                cur_indent = get_indent(l)

                if not stripped:
                    j += 1
                    continue

                if cur_indent == field_indent:
                    # A field at same indent as repo:
                    if re.match(r'description:\s', stripped) or stripped.startswith('description:'):
                        desc_end_idx = j
                        # Advance past any continuation lines
                        k = j + 1
                        while k < len(lines):
                            cont = lines[k]
                            if not cont.strip():
                                k += 1
                                continue
                            if is_continuation_line(cont, field_indent):
                                desc_end_idx = k
                                k += 1
                            else:
                                break
                        j = k
                        continue
                    elif re.match(r'note:\s', stripped) or stripped.startswith('note:'):
                        note_end_idx = j
                        # Advance past any continuation lines
                        k = j + 1
                        while k < len(lines):
                            cont = lines[k]
                            if not cont.strip():
                                k += 1
                                continue
                            if is_continuation_line(cont, field_indent):
                                note_end_idx = k
                                k += 1
                            else:
                                break
                        j = k
                        continue
                    elif re.match(r'tags:\s', stripped) or stripped.startswith('tags:'):
                        already_has_tags = True
                        break
                    elif stripped.startswith('- name:') or re.match(r'name:\s', stripped):
                        # New entry
                        break
                    else:
                        # Other field - just skip
                        pass
                elif cur_indent < field_indent:
                    # Left this entry
                    break

                j += 1

            if not already_has_tags:
                insert_after = note_end_idx if note_end_idx is not None else desc_end_idx
                if insert_after is not None:
                    pending[insert_after] = f'{indent}tags: [{tags_str}]'
    i += 1

print(f'Inserting tags for {len(pending)} entries', file=sys.stderr)

# Rebuild the file with insertions
new_lines = []
for idx, line in enumerate(lines):
    new_lines.append(line)
    if idx in pending:
        new_lines.append(pending[idx])

new_content = '\n'.join(new_lines)

with open(projects_file, 'w') as f:
    f.write(new_content)

print(f'Done. Added tags to {len(pending)} entries in {projects_file}', file=sys.stderr)
