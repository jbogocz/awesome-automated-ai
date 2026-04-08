<div align="center">

# Awesome AutoML [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

A curated list of 200+ tools for automated machine learning - from hyperparameter optimization to autonomous AI agents.

[![Views](https://hits.sh/github.com/jbogocz/awesome-automl.svg?style=flat-square&label=views)](https://hits.sh/github.com/jbogocz/awesome-automl/)
[![GitHub stars](https://img.shields.io/github/stars/jbogocz/awesome-automl?style=flat-square)](https://github.com/jbogocz/awesome-automl/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/jbogocz/awesome-automl?style=flat-square)](https://github.com/jbogocz/awesome-automl/commits)
[![License: CC0 + MIT](https://img.shields.io/badge/license-CC0_+_MIT-green?style=flat-square)](LICENSE)
[![Tools](https://img.shields.io/badge/tools-200+-blue?style=flat-square)](#contents)

</div>

<div align="center">

### **[> Explore interactively <](https://jbogocz.github.io/awesome-automl)**

200+ tools across 25 categories

</div>

> [!TIP]
> ### Why this list?
>
> Every other awesome-automl list stopped updating. Since then:
>
> - **Foundation models replaced entire ML pipelines** - TabPFN matches tuned XGBoost in 2.8 seconds on small datasets.
> - **Autonomous AI agents** now run hundreds of ML experiments overnight without human intervention.
> - **Prompt engineering became prompt optimization** - DSPy outperforms hand-crafted prompts by up to 46%.
> - **ML engineering itself got automated** - from data labeling to deployment to monitoring.
>
> This list covers both the classical tools that still power production ML and the new wave that is replacing them.

### Who is this for?

- **ML engineers** automating training, evaluation, and deployment pipelines
- **AI researchers** tracking automated experimentation, NAS, and agentic ML
- **Product builders** using foundation models to skip traditional ML entirely
- **Anyone** who wants machines to do the machine learning

## Contents

**Core AutoML**
- [General-Purpose AutoML](#general-purpose-automl) (15)
- [Neural Architecture Search](#neural-architecture-search) (7)
- [Hyperparameter Optimization](#hyperparameter-optimization) (9)
- [Automated Feature Engineering](#automated-feature-engineering) (9)
- [AutoML Benchmarks](#automl-benchmarks) (5)

**AI-Native AutoML**
- [Foundation Models as AutoML](#foundation-models-as-automl) (8)
- [Automated Fine-Tuning](#automated-fine-tuning) (12)
- [Automated Prompt Optimization](#automated-prompt-optimization) (9)
- [Automated AI Research](#automated-ai-research) (10)
- [ML Engineering Agents](#ml-engineering-agents) (6)

**LLM Operations**
- [LLM Evaluation and Testing](#llm-evaluation-and-testing) (10)
- [LLM Routing and Selection](#llm-routing-and-selection) (5)

**ML Lifecycle Automation**
- [Time-Series AutoML](#time-series-automl) (13)
- [Automated Data Preprocessing](#automated-data-preprocessing) (8)
- [Automated Data Labeling](#automated-data-labeling) (9)
- [Synthetic Data Generation](#synthetic-data-generation) (7)
- [Automated Model Compression](#automated-model-compression) (9)
- [Automated Deployment and Serving](#automated-deployment-and-serving) (16)
- [Automated Monitoring and Observability](#automated-monitoring-and-observability) (8)
- [Automated AI Safety](#automated-ai-safety) (6)
- [MLOps and Experiment Tracking](#mlops-and-experiment-tracking) (16)

**Resources**
- [Papers and Research](#papers-and-research)
- [Books and Courses](#books-and-courses) (3)
- [Conferences and Communities](#conferences-and-communities) (4)
- [Related Awesome Lists](#related-awesome-lists) (6)

### Legend

| Symbol | Meaning |
|:-------|:--------|
| 12,100 | GitHub stars (updates on each `generate` run) |
| 2026-04 | Last commit date as YYYY-MM |
| `MIT` | SPDX license identifier |
| :1st_place_medal: :2nd_place_medal: :3rd_place_medal: | Quality score - top 3 per category |
| :arrow_upper_right: 340 | Stars gained in last 30 days |
| :left_right_arrow: | Stable (fewer than 10 stars gained/lost) |
| :zzz: | Unmaintained - no commits for 12+ months |
| :file_cabinet: | Historical - included for foundational influence |
| **Archived** | Repository archived by maintainer |

### Quick Comparison: General-Purpose AutoML

| Framework | Stars | Updated | Best For | Modalities |
|:----------|:------|:--------|:---------|:-----------|
| [Ludwig](https://github.com/ludwig-ai/ludwig) | 11,665 | 2026-04 | Declarative deep learning | Tabular, text, image |
| [AutoGluon](https://github.com/autogluon/autogluon) | 10,209 | 2025-12 | Overall accuracy | Tabular, text, image, TS |
| [TPOT](https://github.com/EpistasisLab/tpot) | 10,047 | 2025-07 | Pipeline discovery | Tabular (sklearn) |
| [PyCaret](https://github.com/pycaret/pycaret) | 9,738 | 2024-04 | Quick prototyping | Tabular |
| [AutoKeras](https://github.com/keras-team/autokeras) | 9,315 | 2025-11 | Deep learning | Image, text, tabular |
| [H2O AutoML](https://github.com/h2oai/h2o-3) | 7,522 | 2026-03 | Enterprise / distributed | Tabular |
| [FLAML](https://github.com/microsoft/FLAML) | 4,320 | 2026-01 | Resource-constrained | Tabular |
| [MLJAR](https://github.com/mljar/mljar-supervised) | 3,251 | 2026-03 | Explainability | Tabular |

## General-Purpose AutoML

*End-to-end frameworks that automate model selection, hyperparameter tuning, and pipeline construction.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Ludwig](https://github.com/ludwig-ai/ludwig) 🥇 <sup>↔️</sup> | 11,665 | 2026-04 | `Apache-2.0` | Declarative deep learning framework supporting custom model building and LLM fine-tuning via YAML configs. Now under Linux Foundation AI & Data. |
| [H2O AutoML](https://github.com/h2oai/h2o-3) 🥈 <sup>↔️</sup> | 7,522 | 2026-03 | `Apache-2.0` | Distributed machine learning platform with automatic training and tuning of many models within a user-specified time limit. |
| [LazyPredict](https://github.com/shankarpandala/lazypredict) 🥉 <sup>↔️</sup> | 3,308 | 2026-03 | `MIT` | Build and evaluate dozens of scikit-learn models in a single line of code for rapid baseline comparison. **Low activity since 2022.** |
| [MLJAR Supervised](https://github.com/mljar/mljar-supervised) <sup>↔️</sup> | 3,251 | 2026-03 | `MIT` | Automated ML with automatic explanations, visualizations, and Markdown reports for every trained model. |
| [AutoGluon](https://github.com/autogluon/autogluon) <sup>↔️</sup> | 10,209 | 2025-12 | `Apache-2.0` | Multi-layer stack ensembling for tabular, text, image, time-series, and multimodal data - won medals in 15/18 Kaggle tabular contests in 2024 (Amazon). |
| [AutoKeras](https://github.com/keras-team/autokeras) <sup>↔️</sup> | 9,315 | 2025-11 | `Apache-2.0` | Neural architecture search for deep learning models built on top of Keras. |
| [FLAML](https://github.com/microsoft/FLAML) <sup>↔️</sup> | 4,320 | 2026-01 | `MIT` | Fast and lightweight AutoML that finds good models with minimal resources - often the best choice for resource-constrained environments (Microsoft). |
| [TPOT](https://github.com/EpistasisLab/tpot) <sup>↔️</sup> | 10,047 | 2025-07 | `LGPL-3.0` | Genetic programming-based pipeline optimizer that designs and optimizes scikit-learn pipelines. |
| [SapientML](https://github.com/sapientml/sapientml) <sup>↔️</sup> | 449 | 2026-03 | `Apache-2.0` | Generative AutoML that synthesizes pipelines by learning from a corpus of existing ML solutions. |
| [LightAutoML](https://github.com/sb-ai-lab/LightAutoML) <sup>↔️</sup> | 1,458 | 2025-12 | `Apache-2.0` | Fast and customizable AutoML framework with Kaggle-winning performance (Sber AI Lab). |
| *[PyCaret](https://github.com/pycaret/pycaret)* 💤 | *9,738* | *2024-04* | `MIT` | *Low-code machine learning library that automates model training, tuning, and deployment workflows in Python. **Unmaintained - no commits for 12+ months.*** |
| *[auto-sklearn](https://github.com/automl/auto-sklearn)* 💤 | *8,079* | *2023-02* | `BSD-3-Clause` | *Historically important AutoML toolkit using Bayesian optimization, meta-learning, and ensemble construction. **Unmaintained since Sep 2022; broken on Python 3.10+.*** |
| *[EvalML](https://github.com/alteryx/evalml)* 💤 | *846* | *2024-06* | `BSD-3-Clause` | *AutoML library for building, optimizing, and evaluating ML pipelines with domain-specific objectives (Alteryx). **Unmaintained - no commits for 12+ months.*** |
| *[GAMA](https://github.com/amore-labs/gama)* 💤 | *103* | *2024-06* | `Apache-2.0` | *AutoML tool that generates optimized ML pipelines using genetic programming and Bayesian optimization (OpenML). **Unmaintained - no commits for 12+ months.*** |
| *[Auto-WEKA](https://github.com/automl/autoweka)* 🗄️ | *336* | *2022-03* | - | *The original AutoML system (2013) combining algorithm selection and HPO in WEKA. **Historical; Java-only, maintenance mode.*** |

**[⬆ Back to Contents](#contents)**

## Foundation Models as AutoML

*Pretrained models that replace traditional pipeline-search AutoML with a single forward pass or zero-shot inference.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [TabPFN](https://github.com/PriorLabs/TabPFN) 🥇 <sup>↔️</sup> | 6,012 | 2026-04 | `NOASSERTION` | Tabular foundation model that matches tuned XGBoost in 2.8 seconds with a single forward pass - 100% win rate vs default XGBoost on datasets under 10K rows (Nature 2024, now v2.6 supporting up to 100K rows). |
| [Chronos](https://github.com/amazon-science/chronos-forecasting) 🥈 <sup>↔️</sup> | 5,090 | 2025-12 | `Apache-2.0` | Pretrained time-series foundation model for zero-shot probabilistic forecasting on unseen data (Amazon). |
| *[TimesFM](https://github.com/google-research/timesfm)* 💤 | *15,493* | *2024-12* | `Apache-2.0` | *Time-series foundation model for zero-shot forecasting across domains without task-specific training (Google). **Unmaintained - no commits for 12+ months.*** |
| [TALENT](https://github.com/LAMDA-Tabular/TALENT) 🥉 <sup>↔️</sup> | 835 | 2026-03 | `MIT` | Comprehensive toolkit and benchmark for tabular learning covering 35+ deep methods across 300 datasets. |
| [TabICL](https://github.com/soda-inria/tabicl) <sup>↔️</sup> | 717 | 2026-03 | `NOASSERTION` | State-of-the-art tabular foundation model achieving 10x faster inference than TabPFN v2.5 (ICML 2025). |
| [Moirai](https://github.com/SalesforceAIResearch/uni2ts) <sup>↔️</sup> | 1,463 | 2025-11 | `Apache-2.0` | Universal time-series forecasting transformer supporting multivariate forecasting unlike most competitors. Moirai-MoE released Oct 2024 (Salesforce). |
| [TabM](https://github.com/yandex-research/tabm) <sup>↔️</sup> | 987 | 2025-08 | `Apache-2.0` | Parameter-efficient ensemble of MLPs based on BatchEnsemble, achieving top performance among tabular deep learning models without attention complexity (ICLR 2025, Yandex). |
| [CARTE](https://github.com/soda-inria/carte) <sup>↔️</sup> | 169 | 2025-08 | `BSD-3-Clause` | Context-aware tabular representation using pretrained language models for data with heterogeneous columns. |

**[⬆ Back to Contents](#contents)**

## Automated Fine-Tuning

*Tools that automate the process of adapting large language models to specific tasks and domains.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Unsloth](https://github.com/unslothai/unsloth) 🥇 <sup>↗️ 97</sup> | 60,067 | 2026-04 | `Apache-2.0` | Fine-tune LLMs 2-5x faster with 80% less memory on a single GPU through optimized kernels and custom autograd. |
| [LLaMA-Factory](https://github.com/hiyouga/LlamaFactory) 🥈 <sup>↗️ 29</sup> | 69,721 | 2025-12 | `Apache-2.0` | Unified fine-tuning framework for 100+ LLMs and VLMs with Full, LoRA, QLoRA, and DoRA methods plus web UI (ACL 2024). |
| [TRL](https://github.com/huggingface/trl) 🥉 <sup>↔️</sup> | 17,965 | 2026-03 | `Apache-2.0` | Transformer Reinforcement Learning with SFT, DPO, RLHF, and GRPO trainers for alignment and preference tuning (Hugging Face). |
| [Axolotl](https://github.com/axolotl-ai-cloud/axolotl) <sup>↔️</sup> | 11,608 | 2026-04 | `Apache-2.0` | Production-grade fine-tuning with multi-GPU support, sequence parallelism, and multimodal capabilities. |
| [PEFT](https://github.com/huggingface/peft) <sup>↔️</sup> | 20,900 | 2026-01 | `Apache-2.0` | Standard library for parameter-efficient fine-tuning - LoRA, QLoRA, Spectrum, and more. Deeply integrated with the Hugging Face ecosystem. |
| [H2O LLM Studio](https://github.com/h2oai/h2o-llmstudio) <sup>↔️</sup> | 4,907 | 2026-04 | `Apache-2.0` | No-code GUI for fine-tuning LLMs with SFT, DPO, and RLHF, plus experiment tracking and one-click Hugging Face Hub export (H2O.ai). |
| [LitGPT](https://github.com/Lightning-AI/litgpt) <sup>↔️</sup> | 13,284 | 2025-12 | `Apache-2.0` | Recipes for pretraining, fine-tuning, and deploying 20+ LLM architectures on your own data (Lightning AI). |
| [Hugging Face AutoTrain](https://github.com/huggingface/autotrain-advanced) <sup>↔️</sup> | 4,569 | 2026-01 | `Apache-2.0` | No-code training for LLMs, vision-language models, text classification, and tabular data (Hugging Face). |
| [LMFlow](https://github.com/OptimalScale/LMFlow) <sup>↔️</sup> | 8,489 | 2025-07 | `Apache-2.0` | Extensible toolkit for fine-tuning and inference of large foundation models, NAACL 2024 Best Demo Award. |
| [LLM Foundry](https://github.com/mosaicml/llm-foundry) <sup>↔️</sup> | 4,397 | 2025-07 | `Apache-2.0` | Composable building blocks for pretraining, fine-tuning, and evaluating foundation models with efficient distributed training (Databricks). |
| *[torchtune](https://github.com/meta-pytorch/torchtune)* 💤 | *5,725* | *2025-04* | `BSD-3-Clause` | *Native PyTorch library for fine-tuning LLMs with composable building blocks and YAML configs (Meta). **Unmaintained - no commits for 12+ months.*** |
| *[LoRAX](https://github.com/predibase/lorax)* 💤 | *3,744* | *2025-01* | `Apache-2.0` | *Multi-LoRA inference server that scales to thousands of fine-tuned LLMs on a single GPU (Predibase). **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Automated Prompt Optimization

*Systematic optimization of prompts, instructions, and demonstrations to improve LLM performance without manual tuning.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [DSPy](https://github.com/stanfordnlp/dspy) 🥇 <sup>↗️ 13</sup> | 33,526 | 2026-02 | `MIT` | Declarative framework replacing hand-written prompts with automatic optimizers - GPT-3.5 with DSPy outperforms expert prompts by up to 46% (Stanford NLP). |
| [GEPA](https://github.com/gepa-ai/gepa) 🥈 <sup>↗️ 14</sup> | 3,228 | 2026-03 | `MIT` | Reflective text evolution for prompt, code, and text optimization, integrated into MLflow (Cerebras). |
| [Mirascope](https://github.com/Mirascope/mirascope) 🥉 <sup>↔️</sup> | 1,454 | 2026-03 | `MIT` | Pythonic toolkit for building LLM applications with integrated prompt versioning, tracing, and optimization. |
| [PromptWizard](https://github.com/microsoft/PromptWizard) <sup>↔️</sup> | 3,831 | 2025-08 | `MIT` | Task-aware agent-driven prompt optimization using self-evolving critique and synthesis (Microsoft). |
| [Prompt-Ops](https://github.com/meta-llama/prompt-ops) <sup>↔️</sup> | 795 | 2025-12 | `MIT` | Open-source command-line tool for building, optimizing, and managing prompts at scale (Meta). |
| *[TextGrad](https://github.com/zou-group/textgrad)* 💤 | *3,474* | *2024-12* | `MIT` | *Automatic differentiation via text feedback, enabling gradient-like optimization of compound AI systems (Nature 2024). **Unmaintained - no commits for 12+ months.*** |
| *[AutoPrompt](https://github.com/Eladlev/AutoPrompt)* 💤 | *2,960* | *2024-03* | `Apache-2.0` | *Intent-based prompt calibration using synthetic data generation for iterative prompt refinement. **Unmaintained - no commits for 12+ months.*** |
| [Promptomatix](https://github.com/SalesforceAIResearch/promptomatix) <sup>↔️</sup> | 938 | 2025-07 | `Apache-2.0` | DSPy-powered automatic prompt optimization that transforms task descriptions into optimized prompts with cost-aware objectives (Salesforce). |
| [EvoPrompt](https://github.com/beeevita/EvoPrompt) <sup>↔️</sup> | 224 | 2025-09 | `MIT` | Connects LLMs with evolutionary algorithms for discrete prompt optimization with up to 25% improvement over manual prompts. |

**[⬆ Back to Contents](#contents)**

## Automated AI Research

*Autonomous systems that design experiments, run them, and analyze results without human intervention.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [AutoResearch](https://github.com/karpathy/autoresearch) 🥇 <sup>↗️ 280</sup> | 68,363 | 2026-03 | - | Minimal script enabling AI agents to autonomously run ~100 ML experiments overnight at ~12/hour, finding genuine improvements that transfer to larger models (Karpathy, March 2026). |
| [CrewAI](https://github.com/crewAIInc/crewAI) 🥈 <sup>↗️ 36</sup> | 48,309 | 2026-04 | `MIT` | Multi-agent framework orchestrating role-playing specialist agents for complex AI workflows. |
| [PaperQA](https://github.com/Future-House/paper-qa) 🥉 <sup>↔️</sup> | 8,348 | 2026-03 | `Apache-2.0` | High-accuracy retrieval-augmented generation for answering questions from scientific literature. |
| [AutoGen](https://github.com/microsoft/autogen) <sup>↗️ 14</sup> | 56,808 | 2025-09 | `CC-BY-4.0` | Multi-agent conversation framework for building AI agent systems. Now in maintenance mode as AG2 (Microsoft). |
| [AI-Scientist](https://github.com/SakanaAI/AI-Scientist) <sup>↗️ 16</sup> | 13,115 | 2025-12 | `NOASSERTION` | Fully automated open-ended scientific discovery from idea generation to experiment execution to paper writing (Sakana AI). |
| [AI-Scientist-v2](https://github.com/SakanaAI/AI-Scientist-v2) <sup>↗️ 43</sup> | 5,250 | 2025-12 | `NOASSERTION` | Second generation using agentic tree search, producing the first AI-generated paper accepted at a peer-reviewed workshop. |
| *[STORM](https://github.com/stanford-oval/storm)* 💤 | *28,060* | *2025-01* | `MIT` | *LLM-powered knowledge curation that researches topics and generates full articles with citations (Stanford). **Unmaintained - no commits for 12+ months.*** |
| [AIDE](https://github.com/WecoAI/aideml) <sup>↔️</sup> | 1,212 | 2025-11 | `MIT` | ML engineering agent using tree search over solution space - exceeds 50% of human Kaggle competitors; top agents using AIDE achieve medals in 64%+ of MLE-Bench competitions (Weco AI). |
| [AI-Researcher](https://github.com/HKUDS/AI-Researcher) <sup>↔️</sup> | 5,072 | 2025-10 | - | Autonomous agent automating the full research lifecycle from literature review to experimentation (NeurIPS 2025 Spotlight). |
| [AutoML-Agent](https://github.com/DeepAuto-AI/automl-agent) <sup>↔️</sup> | 118 | 2025-07 | - | Multi-agent LLM framework for full-pipeline AutoML from data retrieval through model deployment (ICML 2025). |

**[⬆ Back to Contents](#contents)**

## ML Engineering Agents

*AI agents that autonomously write, debug, and optimize code for software and ML engineering.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [OpenHands](https://github.com/OpenHands/OpenHands) 🥇 <sup>↗️ 28</sup> | 70,796 | 2026-03 | `NOASSERTION` | AI software development platform achieving 53-72% resolve rate on SWE-Bench Verified. |
| [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) 🥈 <sup>↔️</sup> | 3,710 | 2026-03 | `MIT` | Minimalist 100-line coding agent achieving 74% on SWE-bench Verified as a learning reference. |
| [AutoRAG](https://github.com/Marker-Inc-Korea/AutoRAG) 🥉 <sup>↔️</sup> | 4,687 | 2026-04 | `Apache-2.0` | AutoML-style framework for RAG optimization that automatically finds the best retrieval, generation, and prompt pipeline configuration. |
| [Aider](https://github.com/Aider-AI/aider) <sup>↗️ 16</sup> | 42,981 | 2025-08 | `Apache-2.0` | AI pair programmer in the terminal that edits code directly in your local repository. |
| [SWE-agent](https://github.com/SWE-agent/SWE-agent) <sup>↔️</sup> | 18,947 | 2025-05 | `MIT` | Autonomous agent that solves real GitHub issues by reading, editing, and testing code (NeurIPS 2024). |
| *[AutoCodeRover](https://github.com/AutoCodeRoverSG/auto-code-rover)* 💤 | *3,064* | *2024-09* | `NOASSERTION` | *Structure-aware autonomous program repair combining code search with LLM-based patching. **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## LLM Evaluation and Testing

*Frameworks for automated evaluation, testing, and benchmarking of language models and AI systems.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Promptfoo](https://github.com/promptfoo/promptfoo) 🥇 <sup>↗️ 24</sup> | 19,733 | 2026-03 | `MIT` | Test and red-team LLM applications with automated evaluations, CI/CD integration, and vulnerability scanning. |
| [RAGAS](https://github.com/vibrantlabsai/ragas) 🥈 <sup>↔️</sup> | 13,275 | 2026-01 | `Apache-2.0` | Evaluation framework for RAG quality assessment measuring both retrieval and generation with LLM-based and traditional metrics. |
| [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) 🥉 <sup>↔️</sup> | 12,046 | 2026-02 | `MIT` | Standard framework for few-shot evaluation of language models across hundreds of benchmarks (EleutherAI). |
| [Agenta](https://github.com/Agenta-AI/agenta) <sup>↔️</sup> | 4,013 | 2026-04 | `NOASSERTION` | Open-source LLMOps platform combining prompt playground, evaluation workflows, and production observability. |
| [DeepEval](https://github.com/confident-ai/deepeval) <sup>↗️ 17</sup> | 14,593 | 2025-12 | `Apache-2.0` | Pytest-like framework with 14+ evaluation metrics for RAG, fine-tuning, and alignment assessment. |
| [OpenCompass](https://github.com/open-compass/opencompass) <sup>↔️</sup> | 6,837 | 2026-02 | `Apache-2.0` | One-stop evaluation platform supporting 100+ models across academic and real-world benchmarks. |
| [TruLens](https://github.com/truera/trulens) <sup>↔️</sup> | 3,233 | 2026-03 | `MIT` | OpenTelemetry-based tracing and evaluation for RAG and agent workflows with built-in feedback functions (Snowflake/TruEra). |
| [LangWatch](https://github.com/langwatch/langwatch) <sup>↔️</sup> | 3,187 | 2026-04 | `NOASSERTION` | Evaluation and testing platform for LLM applications and AI agents with automated quality guardrails. |
| [Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai) <sup>↔️</sup> | 1,889 | 2026-04 | `MIT` | Framework for reproducible LLM evals with sandboxed agent execution, 100+ prebuilt evaluations, and VS Code integration (UK AI Safety Institute). |
| [LightEval](https://github.com/huggingface/lighteval) <sup>↔️</sup> | 2,369 | 2025-11 | `MIT` | All-in-one LLM evaluation toolkit powering the Open LLM Leaderboard, supporting 1000+ tasks across multiple backends (Hugging Face). |

**[⬆ Back to Contents](#contents)**

## LLM Routing and Selection

*Intelligent routing of requests to the optimal model based on task complexity, cost, and performance.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [LiteLLM](https://github.com/BerriAI/litellm) 🥇 <sup>↗️ 47</sup> | 42,517 | 2026-04 | `NOASSERTION` | Unified API gateway for 100+ LLMs with load balancing, cost tracking, and automatic fallback routing. |
| [TensorZero](https://github.com/tensorzero/tensorzero) 🥈 <sup>↔️</sup> | 11,190 | 2026-04 | `Apache-2.0` | Open-source LLMOps platform unifying an LLM gateway, observability, evaluation, optimization, and experimentation with A/B testing across models. |
| [Portkey Gateway](https://github.com/Portkey-AI/gateway) 🥉 <sup>↔️</sup> | 11,236 | 2026-01 | `MIT` | AI gateway for intelligent routing, caching, load balancing, and fallbacks across 200+ LLMs. |
| [LLMRouter](https://github.com/ulab-uiuc/LLMRouter) <sup>↔️</sup> | 1,609 | 2026-03 | `MIT` | Unified library with 16+ router implementations and standardized evaluation via command-line interface. |
| *[RouteLLM](https://github.com/lm-sys/RouteLLM)* 💤 | *4,768* | *2024-08* | `Apache-2.0` | *Framework for training and serving LLM routers that reduce costs by up to 85% without quality loss (LMSYS). **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Time-Series AutoML

*Automated forecasting, classification, and anomaly detection for temporal data.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Darts](https://github.com/unit8co/darts) 🥇 <sup>↔️</sup> | 9,311 | 2026-03 | `Apache-2.0` | Unified API for 30+ forecasting models from ARIMA to transformers, with backtesting and ensembling built in. |
| [Nixtla NeuralForecast](https://github.com/Nixtla/neuralforecast) 🥈 <sup>↔️</sup> | 4,034 | 2026-03 | `Apache-2.0` | Production-ready neural forecasting with 30+ state-of-the-art models including N-BEATS, TFT, and PatchTST. |
| [sktime](https://github.com/sktime/sktime) 🥉 <sup>↔️</sup> | 9,714 | 2025-11 | `BSD-3-Clause` | Unified framework for time-series forecasting, classification, regression, and clustering with scikit-learn-compatible interfaces. |
| [PyPOTS](https://github.com/WenjieDu/PyPOTS) <sup>↔️</sup> | 1,984 | 2026-03 | `BSD-3-Clause` | Toolbox with 50+ deep learning models for partially-observed time-series imputation, classification, and clustering. |
| [skforecast](https://github.com/skforecast/skforecast) <sup>↔️</sup> | 1,473 | 2026-03 | `BSD-3-Clause` | Scikit-learn-compatible multi-step forecasting with XGBoost, LightGBM, CatBoost, and feature engineering utilities. |
| [AutoTS](https://github.com/winedarksea/AutoTS) <sup>↔️</sup> | 1,385 | 2026-03 | `MIT` | Genetic algorithm-based automated model selection, ensembling, and anomaly detection for time-series data. |
| [aeon](https://github.com/aeon-toolkit/aeon) <sup>↔️</sup> | 1,367 | 2026-03 | `BSD-3-Clause` | Next-generation time-series ML toolkit for classification, regression, clustering, and anomaly detection. |
| [Nixtla MLForecast](https://github.com/Nixtla/mlforecast) <sup>↔️</sup> | 1,204 | 2026-03 | `Apache-2.0` | Scalable ML-based forecasting with LightGBM, XGBoost, and distributed backends via Dask, Spark, and Ray. |
| [Time-MoE](https://github.com/Time-MoE/Time-MoE) <sup>↔️</sup> | 943 | 2026-03 | `Apache-2.0` | First billion-scale time-series foundation model using sparse mixture-of-experts, trained on 300B+ time points (ICLR 2025 Spotlight). |
| [Nixtla StatsForecast](https://github.com/Nixtla/statsforecast) <sup>↔️</sup> | 4,746 | 2025-10 | `Apache-2.0` | Lightning-fast statistical models including AutoARIMA, AutoETS, and AutoCES for millions of time series. |
| [Granite-TSFM](https://github.com/ibm-granite/granite-tsfm) <sup>↔️</sup> | 834 | 2026-03 | `Apache-2.0` | Compact pretrained Tiny Time Mixers that rival billion-parameter models for zero/few-shot multivariate forecasting (IBM, NeurIPS 2024). |
| [Lag-Llama](https://github.com/time-series-foundation-models/lag-llama) <sup>↔️</sup> | 1,568 | 2025-06 | `Apache-2.0` | First open-source foundation model for univariate probabilistic time-series forecasting based on a decoder-only transformer (NeurIPS 2024). |
| *[Merlion](https://github.com/salesforce/Merlion)* 💤 | *4,471* | *2023-02* | `BSD-3-Clause` | *Time-series intelligence library with unified interfaces for forecasting, anomaly detection, and change-point detection (Salesforce). **Archived.*** |

**[⬆ Back to Contents](#contents)**

## Neural Architecture Search

*Automated design and discovery of optimal neural network architectures.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| *[Google AutoML](https://github.com/google/automl)* 💤 | *6,463* | *2021-03* | `Apache-2.0` | *Research code for EfficientNet, EfficientDet, MnasNet, and other NAS-discovered architectures (Google Brain). **Unmaintained - no commits for 12+ months.*** |
| *[Once-For-All](https://github.com/mit-han-lab/once-for-all)* 💤 | *1,947* | *2020-06* | `MIT` | *Train one network and specialize sub-networks for diverse hardware without retraining (MIT HAN Lab, ICLR 2020). **Unmaintained - no commits for 12+ months.*** |
| *[TinyEngine](https://github.com/mit-han-lab/tinyengine)* 💤 | *934* | *2024-11* | `MIT` | *Memory-efficient inference engine for NAS-optimized models on microcontrollers (MIT HAN Lab). **Unmaintained - no commits for 12+ months.*** |
| *[NNI](https://github.com/microsoft/nni)* 💤 | *14,347* | *2023-09* | `MIT` | *Comprehensive AutoML toolkit for NAS, hyperparameter tuning, feature engineering, and model compression. **Archived by Microsoft in Sep 2024.*** |
| *[Vega](https://github.com/huawei-noah/vega)* 💤 | *851* | *2022-09* | `NOASSERTION` | *AutoML pipeline covering NAS, hyperparameter optimization, auto-augmentation, and model compression (Huawei). **Unmaintained - no commits for 12+ months.*** |
| *[NASLib](https://github.com/automl/NASLib)* 💤 | *586* | *2024-07* | `Apache-2.0` | *NAS research library from AutoML Freiburg with interfaces to state-of-the-art search spaces and optimizers. **Unmaintained - no commits for 12+ months.*** |
| *[Archai](https://github.com/microsoft/archai)* 💤 | *483* | *2023-09* | `MIT` | *Modular NAS framework for reproducible architecture search research (Microsoft). **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Hyperparameter Optimization

*Automated tuning of model hyperparameters using Bayesian, evolutionary, and other search strategies.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Ray Tune](https://docs.ray.io/en/latest/tune/) 🥇 <sup>↗️ 12</sup> | 42,015 | 2026-03 | `Apache-2.0` | Distributed hyperparameter tuning at scale with support for any ML framework and many search algorithms. |
| [Optuna](https://github.com/optuna/optuna) 🥈 <sup>↔️</sup> | 13,871 | 2026-03 | `MIT` | Define-by-run API with pruning, distributed execution, and a dashboard - the most widely adopted HPO framework. |
| *[Hyperopt](https://github.com/hyperopt/hyperopt)* 💤 | *7,616* | *2026-02* | `NOASSERTION` | *Pioneered tree-structured Parzen estimators for HPO. **Deprecated since Nov 2021 - use Optuna instead.*** |
| [BoTorch](https://github.com/meta-pytorch/botorch) 🥉 <sup>↔️</sup> | 3,498 | 2026-03 | `MIT` | Bayesian optimization library in PyTorch for high-dimensional, noisy, and multi-objective problems (Meta). |
| [Ax](https://github.com/facebook/Ax) <sup>↔️</sup> | 2,733 | 2026-03 | `MIT` | Adaptive experimentation platform for multi-objective optimization with BoTorch integration (Meta). |
| [Keras Tuner](https://github.com/keras-team/keras-tuner) <sup>↔️</sup> | 2,923 | 2025-11 | `Apache-2.0` | Hyperparameter search for Keras models with built-in Bayesian optimization and Hyperband. |
| *[Google Vizier](https://github.com/google/vizier)* 💤 | *1,635* | *2025-02* | `Apache-2.0` | *Research interface for blackbox and hyperparameter optimization with Bayesian, evolutionary, and multi-objective algorithms based on Google's internal Vizier Service. **Unmaintained - no commits for 12+ months.*** |
| *[SMAC3](https://github.com/automl/SMAC3)* 💤 | *1,218* | *2025-01* | `NOASSERTION` | *Sequential model-based algorithm configuration combining Bayesian optimization with racing mechanisms (AutoML Freiburg). **Unmaintained - no commits for 12+ months.*** |
| *[Dragonfly](https://github.com/dragonfly/dragonfly)* 💤 | *893* | *2022-10* | `MIT` | *Scalable Bayesian optimization library supporting multi-fidelity and multi-objective search. **Low activity since 2020.*** |

**[⬆ Back to Contents](#contents)**

## Automated Feature Engineering

*Automated generation, transformation, and selection of features from raw data.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Cleanlab](https://github.com/cleanlab/cleanlab) 🥇 <sup>↔️</sup> | 11,411 | 2026-01 | `Apache-2.0` | Data-centric AI toolkit for finding and fixing label errors, outliers, and data quality issues automatically. |
| [tsfresh](https://github.com/blue-yonder/tsfresh) 🥈 <sup>↔️</sup> | 9,169 | 2025-08 | `MIT` | Automatic extraction of hundreds of time-series features with built-in statistical relevance filtering. |
| *[Featuretools](https://github.com/alteryx/featuretools)* 💤 | *7,628* | *2024-05* | `BSD-3-Clause` | *Deep feature synthesis for automatically creating meaningful features from relational and temporal data (Alteryx). **Unmaintained - no commits for 12+ months.*** |
| [AutoFeat](https://github.com/cod3licious/autofeat) 🥉 <sup>↔️</sup> | 536 | 2026-01 | `MIT` | Scikit-learn-compatible automated feature engineering and selection that generates non-linear features and selects robust subsets. |
| *[Feature-engine](https://github.com/feature-engine/feature_engine)* 💤 | *2,221* | *2022-01* | `BSD-3-Clause` | *Scikit-learn-compatible transformers for feature creation, selection, encoding, and imputation. **Unmaintained - no commits for 12+ months.*** |
| *[OpenMLDB](https://github.com/4paradigm/OpenMLDB)* 💤 | *1,685* | *2025-02* | `Apache-2.0` | *Database for consistent feature computation between training and serving with SQL-based feature engineering (SIGMOD 2025). **Unmaintained - no commits for 12+ months.*** |
| *[Boruta](https://github.com/scikit-learn-contrib/boruta_py)* 💤 | *1,624* | *2024-08* | `BSD-3-Clause` | *All-relevant feature selection wrapper using random forest shadow features to identify important predictors. **Unmaintained - no commits for 12+ months.*** |
| *[NVTabular](https://github.com/NVIDIA-Merlin/NVTabular)* 💤 | *1,140* | *2023-08* | `Apache-2.0` | *GPU-accelerated feature engineering and preprocessing for terabyte-scale tabular data with automatic hashing, categorification, and normalization (NVIDIA). **Unmaintained - no commits for 12+ months.*** |
| *[CAAFE](https://github.com/noahho/CAAFE)* 💤 | *186* | *2024-12* | `NOASSERTION` | *LLM-powered context-aware feature engineering that generates semantically meaningful features with explanations. **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Automated Data Preprocessing

*Automated data profiling, cleaning, validation, and quality assurance.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Great Expectations](https://github.com/great-expectations/great_expectations) 🥇 <sup>↔️</sup> | 11,368 | 2026-04 | `Apache-2.0` | Programmable data validation and documentation framework for maintaining pipeline quality. |
| [ydata-profiling](https://github.com/Data-Centric-AI-Community/ydata-profiling) 🥈 <sup>↔️</sup> | 13,489 | 2026-01 | `MIT` | One-line data quality profiling and exploratory analysis for Pandas and Spark DataFrames. |
| [Pandera](https://github.com/unionai-oss/pandera) 🥉 <sup>↔️</sup> | 4,290 | 2026-03 | `MIT` | Statistical data testing and validation for dataframes with expressive schema definitions. |
| [SweetViz](https://github.com/fbdesignpro/sweetviz) <sup>↔️</sup> | 3,089 | 2026-04 | `MIT` | High-density EDA visualizations and target analysis reports generated in two lines of code. |
| [Spotlight](https://github.com/Renumics/spotlight) <sup>↔️</sup> | 1,255 | 2026-03 | `MIT` | Interactive visualization tool for auditing and understanding unstructured ML datasets covering images, audio, and text. |
| [pyjanitor](https://github.com/pyjanitor-devs/pyjanitor) <sup>↔️</sup> | 1,486 | 2026-04 | `MIT` | Clean APIs for data cleaning with a fluent method-chaining interface for pandas DataFrames, inspired by the R Janitor package. |
| *[DataPrep](https://github.com/sfu-db/dataprep)* 💤 | *2,237* | *2022-07* | `MIT` | *Low-code library for data collection, cleaning, and EDA that is 10x faster than traditional profiling. **Unmaintained - no commits for 12+ months.*** |
| *[Optimus](https://github.com/hi-primus/optimus)* 💤 | *1,537* | *2020-07* | `Apache-2.0` | *Agile data preparation supporting Pandas, Dask, cuDF, and PySpark with a unified API. **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Automated Data Labeling

*Tools that automate or semi-automate the annotation process using AI-assisted labeling.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Label Studio](https://github.com/HumanSignal/label-studio) 🥇 <sup>↔️</sup> | 26,955 | 2026-03 | `Apache-2.0` | Multi-type data labeling platform with ML-assisted annotation and LLM integration for text, images, audio, and video. |
| [X-AnyLabeling](https://github.com/CVHub520/X-AnyLabeling) 🥈 <sup>↔️</sup> | 8,664 | 2026-03 | `GPL-3.0` | AI-assisted annotation with Segment Anything and other foundation models for automatic segmentation, detection, and classification pre-labeling. |
| *[Snorkel](https://github.com/snorkel-team/snorkel)* 💤 | *5,947* | *2024-02* | `Apache-2.0` | *Programmatic labeling via weak supervision - write labeling functions instead of hand-labeling. **Unmaintained - no commits for 12+ months.*** |
| *[Argilla](https://github.com/argilla-io/argilla)* 💤 | *4,928* | *2025-03* | `Apache-2.0` | *Collaboration platform for collecting and managing human and AI feedback for NLP and LLM development. **Unmaintained - no commits for 12+ months.*** |
| [LabelU](https://github.com/opendatalab/labelU) 🥉 <sup>↔️</sup> | 1,538 | 2025-10 | `Apache-2.0` | Multi-modal annotation toolbox supporting image, audio, and video with configurable templates and collaborative labeling workflows. |
| *[Distilabel](https://github.com/argilla-io/distilabel)* 💤 | *3,157* | *2025-01* | `Apache-2.0` | *Framework for synthetic data generation, AI feedback, and instruction tuning using Self-Instruct and EvolInstruct techniques. **Unmaintained - no commits for 12+ months.*** |
| *[Autodistill](https://github.com/autodistill/autodistill)* 💤 | *2,658* | *2024-02* | `Apache-2.0` | *Automated image labeling by distilling foundation model knowledge into smaller task-specific models (Roboflow). **Unmaintained - no commits for 12+ months.*** |
| *[Autolabel](https://github.com/refuel-ai/autolabel)* 💤 | *2,310* | *2023-10* | `MIT` | *LLM-powered labeling, cleaning, and enrichment for text classification, NER, and entity matching. **Unmaintained - no commits for 12+ months.*** |
| *[Adala](https://github.com/HumanSignal/Adala)* 💤 | *1,419* | *2023-11* | `Apache-2.0` | *Autonomous data labeling agent that uses LLMs to label data, learn from ground truth, and iteratively improve labeling quality (Label Studio team). **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Synthetic Data Generation

*Automated creation of artificial training data that preserves statistical properties of real datasets.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [SDV](https://github.com/sdv-dev/SDV) 🥇 <sup>↔️</sup> | 3,463 | 2026-03 | `NOASSERTION` | Synthetic Data Vault with multiple generative models (GaussianCopula, CTGAN, TVAE) for single-table, multi-table, and sequential data. |
| [NeMo Data Designer](https://github.com/NVIDIA-NeMo/DataDesigner) 🥈 <sup>↗️ 27</sup> | 1,522 | 2026-04 | `Apache-2.0` | Generates high-quality synthetic data from scratch or seed data with built-in evaluation and quality control for LLM training pipelines (NVIDIA). |
| [Curator](https://github.com/bespokelabsai/curator) 🥉 <sup>↔️</sup> | 1,660 | 2026-03 | `Apache-2.0` | Pipeline-oriented synthetic data curation for post-training and structured data extraction with built-in quality filtering from LLMs. |
| [Synthetic Data Kit](https://github.com/meta-llama/synthetic-data-kit) <sup>↔️</sup> | 1,560 | 2025-10 | `MIT` | Toolkit for generating high-quality synthetic datasets to fine-tune models with LLM-generated training data at scale (Meta). |
| *[SDG](https://github.com/hitsz-ids/synthetic-data-generator)* 💤 | *2,416* | *2024-12* | `Apache-2.0` | *Framework for generating high-quality synthetic tabular data preserving statistical distributions and correlations. **Unmaintained - no commits for 12+ months.*** |
| *[DataDreamer](https://github.com/datadreamer-dev/DataDreamer)* 💤 | *1,108* | *2025-02* | `MIT` | *Reproducible LLM workflows for prompting, synthetic data generation, and model training in one pipeline. **Unmaintained - no commits for 12+ months.*** |
| *[Gretel Synthetics](https://github.com/gretelai/gretel-synthetics)* 💤 | *676* | *2025-06* | `NOASSERTION` | *Synthetic data generators for structured and unstructured text with differential privacy guarantees. **Archived.*** |

**[⬆ Back to Contents](#contents)**

## Automated Model Compression

*Automated quantization, pruning, and distillation for efficient model deployment.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [LLM Compressor](https://github.com/vllm-project/llm-compressor) 🥇 <sup>↔️</sup> | 2,986 | 2026-03 | `Apache-2.0` | Transformers-compatible compression library optimized for efficient vLLM inference. |
| [bitsandbytes](https://github.com/bitsandbytes-foundation/bitsandbytes) 🥈 <sup>↔️</sup> | 8,102 | 2026-02 | `MIT` | De facto standard for k-bit quantization of LLMs in PyTorch - enables 4-bit and 8-bit inference and training, the backbone for QLoRA. |
| [NVIDIA TensorRT Model Optimizer](https://github.com/NVIDIA/Model-Optimizer) 🥉 <sup>↔️</sup> | 2,399 | 2026-03 | `Apache-2.0` | Quantization, pruning, distillation, and speculative decoding optimized for TensorRT and vLLM deployment. |
| [GPTQModel](https://github.com/ModelCloud/GPTQModel) <sup>↔️</sup> | 1,093 | 2026-04 | `NOASSERTION` | LLM quantization toolkit with support for NVIDIA CUDA, AMD ROCm, Intel, and Apple Silicon backends. |
| [Olive](https://github.com/microsoft/Olive) <sup>↔️</sup> | 2,288 | 2026-01 | `MIT` | End-to-end model optimization automating fine-tuning, conversion, quantization, and graph optimization for CPUs, GPUs, and NPUs (Microsoft). |
| [Optimum](https://github.com/huggingface/optimum) <sup>↔️</sup> | 3,350 | 2025-12 | `Apache-2.0` | Toolkit for accelerating Transformers inference with hardware-optimized quantization, pruning, and graph optimization for ONNX Runtime, OpenVINO, and more (Hugging Face). |
| [Intel Neural Compressor](https://github.com/intel/neural-compressor) <sup>↔️</sup> | 2,612 | 2025-12 | `Apache-2.0` | Unified quantization, sparsity, pruning, and distillation across PyTorch, TensorFlow, and ONNX (Intel). |
| [LLM-AWQ](https://github.com/mit-han-lab/llm-awq) <sup>↔️</sup> | 3,493 | 2025-07 | `MIT` | Activation-aware weight quantization achieving lossless 4-bit compression for LLMs (MIT HAN Lab, MLSys 2024 Best Paper). |
| [Torch-Pruning](https://github.com/VainF/Torch-Pruning) <sup>↔️</sup> | 3,283 | 2025-09 | `MIT` | Structural pruning framework for any PyTorch model including LLMs, YOLO, ViT, and diffusion models (CVPR 2023). |

**[⬆ Back to Contents](#contents)**

## Automated Deployment and Serving

*Automated model serving, optimization, and inference infrastructure.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [llama.cpp](https://github.com/ggml-org/llama.cpp) 🥇 <sup>↗️ 73</sup> | 102,415 | 2026-04 | `MIT` | LLM inference in C/C++ with broad hardware support - the foundation for most local LLM applications. |
| [Ollama](https://github.com/ollama/ollama) 🥈 <sup>↗️ 58</sup> | 168,090 | 2026-04 | `MIT` | Docker-like local LLM runner for getting models up and running quickly for prototyping. |
| [vLLM](https://github.com/vllm-project/vllm) 🥉 <sup>↗️ 56</sup> | 75,656 | 2026-04 | `Apache-2.0` | High-throughput LLM serving engine with PagedAttention, powering most open-source LLM deployments in production. |
| [SGLang](https://github.com/sgl-project/sglang) <sup>↗️ 20</sup> | 25,546 | 2026-04 | `Apache-2.0` | High-performance LLM serving framework powering 400K+ GPUs with best-in-class structured and constrained decoding. |
| [ONNX Runtime](https://github.com/microsoft/onnxruntime) <sup>↗️ 10</sup> | 19,795 | 2026-03 | `MIT` | Cross-platform inference accelerator supporting PyTorch, TensorFlow, scikit-learn, and XGBoost via the ONNX format (Microsoft). |
| [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) <sup>↔️</sup> | 13,319 | 2026-03 | `NOASSERTION` | High-performance LLM inference library with custom attention kernels, speculative decoding, and MoE support (NVIDIA). |
| [Triton Inference Server](https://github.com/triton-inference-server/server) <sup>↔️</sup> | 10,527 | 2026-03 | `BSD-3-Clause` | Multi-framework inference serving for TensorRT, PyTorch, ONNX, and custom backends (NVIDIA). |
| [OpenVINO](https://github.com/openvinotoolkit/openvino) <sup>↔️</sup> | 10,029 | 2026-04 | `Apache-2.0` | Inference optimization and deployment toolkit for CPUs, GPUs, and edge accelerators (Intel). |
| [BentoML](https://github.com/bentoml/BentoML) <sup>↔️</sup> | 8,563 | 2026-04 | `Apache-2.0` | Build production-ready inference APIs, batch jobs, and multi-model pipelines with unified Python framework. |
| [Cog](https://github.com/replicate/cog) <sup>↔️</sup> | 9,373 | 2026-04 | `Apache-2.0` | Package ML models as standard Docker containers with auto-generated HTTP APIs and GPU setup for reproducible, portable deployment (Replicate). |
| [LMDeploy](https://github.com/InternLM/lmdeploy) <sup>↔️</sup> | 7,759 | 2026-04 | `Apache-2.0` | Toolkit for compressing, deploying, and serving large language and vision-language models. |
| [KServe](https://github.com/kserve/kserve) <sup>↔️</sup> | 5,305 | 2026-03 | `Apache-2.0` | Kubernetes-native standardized model serving with canary rollouts, autoscaling, and multi-framework support (CNCF Incubating). |
| [ExecuTorch](https://github.com/pytorch/executorch) <sup>↔️</sup> | 4,481 | 2026-04 | `NOASSERTION` | On-device AI inference for mobile, embedded, and edge platforms with a 50KB base runtime footprint (Meta). |
| [TFX](https://github.com/tensorflow/tfx) <sup>↔️</sup> | 2,178 | 2026-03 | `Apache-2.0` | End-to-end platform for deploying production ML pipelines with data validation, transformation, training, evaluation, and serving components (Google). |
| [LitServe](https://github.com/Lightning-AI/LitServe) <sup>↔️</sup> | 3,858 | 2025-12 | `Apache-2.0` | Minimal, high-performance Python framework for AI model serving (Lightning AI). |
| [LightLLM](https://github.com/ModelTC/LightLLM) <sup>↔️</sup> | 3,996 | 2025-09 | `Apache-2.0` | Lightweight LLM inference and serving framework with continuous batching, tensor parallelism, and efficient memory management. |

**[⬆ Back to Contents](#contents)**

## Automated Monitoring and Observability

*Automated drift detection, performance monitoring, and quality assurance for deployed models.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Evidently](https://github.com/evidentlyai/evidently) 🥇 <sup>↔️</sup> | 7,376 | 2026-03 | `Apache-2.0` | ML and LLM observability with 100+ metrics for evaluating, testing, and monitoring any AI system in production. |
| [OpenLLMetry](https://github.com/traceloop/openllmetry) 🥈 <sup>↔️</sup> | 6,985 | 2026-03 | `Apache-2.0` | OpenTelemetry-based observability for LLM applications with automatic instrumentation for LangChain, LlamaIndex, and OpenAI SDK. |
| [Giskard](https://github.com/Giskard-AI/giskard-oss) 🥉 <sup>↔️</sup> | 5,224 | 2026-03 | `Apache-2.0` | Testing and evaluation for ML and LLM models covering bias, performance regression, and security vulnerabilities. |
| [Alibi Detect](https://github.com/SeldonIO/alibi-detect) <sup>↔️</sup> | 2,509 | 2025-12 | `NOASSERTION` | Outlier, adversarial, and drift detection algorithms for tabular, text, image, and time-series data (Seldon). |
| [Helicone](https://github.com/Helicone/helicone) <sup>↔️</sup> | 5,462 | 2025-08 | `Apache-2.0` | LLM observability platform with one-line integration for cost tracking, latency analysis, prompt versioning, and usage dashboards (YC W23). |
| [NannyML](https://github.com/NannyML/nannyml) <sup>↔️</sup> | 2,136 | 2025-07 | `Apache-2.0` | Estimate model performance without ground truth labels and link data drift directly to accuracy degradation. |
| *[Deepchecks](https://github.com/deepchecks/deepchecks)* 💤 | *4,002* | *2024-12* | `NOASSERTION` | *Holistic ML validation covering data integrity, drift detection, and model evaluation in a single suite. **Unmaintained - no commits for 12+ months.*** |
| *[WhyLogs](https://github.com/whylabs/whylogs)* 💤 | *2,811* | *2024-12* | `Apache-2.0` | *Lightweight data logging library that profiles datasets for drift detection without storing raw data. **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Automated AI Safety

*Automated testing, red-teaming, and guardrails for ensuring AI system safety and reliability.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Garak](https://github.com/NVIDIA/garak) 🥇 <sup>↔️</sup> | 7,492 | 2026-04 | `Apache-2.0` | LLM vulnerability scanner with 100+ attack modules covering prompt injection, data leakage, and jailbreaking. |
| [Guardrails AI](https://github.com/guardrails-ai/guardrails) 🥈 <sup>↔️</sup> | 6,646 | 2026-04 | `Apache-2.0` | Framework for adding structural and semantic validation guardrails to LLM outputs. |
| [Plano](https://github.com/katanemo/plano) 🥉 <sup>↔️</sup> | 6,226 | 2026-04 | `Apache-2.0` | AI-native proxy with built-in orchestration, safety controls, and observability for agentic applications. |
| [NeMo Guardrails](https://github.com/NVIDIA-NeMo/Guardrails) <sup>↔️</sup> | 5,937 | 2026-03 | `NOASSERTION` | Programmable safety rails for LLM-based conversational systems with topical and safety controls (NVIDIA). |
| [DeepTeam](https://github.com/confident-ai/deepteam) <sup>↗️ 14</sup> | 1,504 | 2025-11 | `Apache-2.0` | Red-teaming framework for systematically testing LLM vulnerabilities across multiple attack vectors. |
| [LLM Guard](https://github.com/protectai/llm-guard) <sup>↔️</sup> | 2,788 | 2025-09 | `MIT` | Security toolkit with input/output scanners for prompt injection, data leakage, toxic content, and other safety risks in production LLM applications. |

**[⬆ Back to Contents](#contents)**

## AutoML Benchmarks

*Standardized frameworks and datasets for evaluating and comparing AutoML systems.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [MLE-Bench](https://github.com/openai/mle-bench) 🥇 <sup>↔️</sup> | 1,448 | 2026-03 | `NOASSERTION` | Benchmark using 75 Kaggle competitions to evaluate ML engineering agents (OpenAI). |
| [TabArena](https://github.com/autogluon/tabarena) 🥈 <sup>↔️</sup> | 207 | 2026-04 | `Apache-2.0` | Living benchmark for tabular ML with continuously maintained leaderboard and best-practice evaluation (NeurIPS 2025 Spotlight). |
| [NAS-Bench-201](https://github.com/D-X-Y/NAS-Bench-201) 🥉 <sup>↔️</sup> | 644 | 2025-10 | `MIT` | Reproducible benchmark with 15,625 evaluated architectures across three datasets for fair NAS comparison. |
| *[AMLB](https://github.com/openml/automlbenchmark)* 💤 | *459* | *2023-09* | `MIT` | *Standard AutoML benchmark comparing frameworks across 104 classification and regression tasks (OpenML). **Unmaintained - no commits for 12+ months.*** |
| *[NAS-Bench-101](https://github.com/google-research/nasbench)* 💤 | *717* | *2019-11* | `Apache-2.0` | *Benchmark dataset with 423,624 evaluated neural architectures for efficient NAS research (Google). **Archived.*** |

**[⬆ Back to Contents](#contents)**

## MLOps and Experiment Tracking

*Platforms for managing the ML lifecycle, tracking experiments, and orchestrating pipelines.*

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [Ray](https://github.com/ray-project/ray) 🥇 <sup>↗️ 12</sup> | 42,015 | 2026-03 | `Apache-2.0` | Unified AI compute engine for distributed training, tuning, and model serving with Ray Train, Ray Tune, and Ray Serve. |
| [Langfuse](https://github.com/langfuse/langfuse) 🥈 <sup>↗️ 41</sup> | 24,520 | 2026-04 | `NOASSERTION` | Open-source LLM engineering platform with tracing, evaluations, prompt management, and cost analytics. |
| [MLflow](https://github.com/mlflow/mlflow) 🥉 <sup>↗️ 18</sup> | 25,199 | 2026-04 | `Apache-2.0` | End-to-end ML lifecycle platform with experiment tracking, model registry, and integrated prompt optimization. |
| [Prefect](https://github.com/PrefectHQ/prefect) <sup>↔️</sup> | 22,095 | 2026-04 | `Apache-2.0` | Modern data workflow automation with retries, caching, and real-time logging. |
| [Opik](https://github.com/comet-ml/opik) <sup>↔️</sup> | 18,702 | 2026-04 | `Apache-2.0` | LLM debugging, evaluation, and monitoring platform with detailed tracing and quality dashboards (Comet). |
| [DVC](https://github.com/treeverse/dvc) <sup>↔️</sup> | 15,513 | 2026-03 | `Apache-2.0` | Version control for data and models with built-in experiment tracking and pipeline management. |
| [Dagster](https://github.com/dagster-io/dagster) <sup>↔️</sup> | 15,246 | 2026-04 | `Apache-2.0` | Asset-centric orchestration built for ML pipelines with data lineage tracking and observability. |
| [W&B](https://github.com/wandb/wandb) <sup>↔️</sup> | 10,973 | 2026-03 | `MIT` | Experiment tracking, visualization, and collaboration platform for ML teams (Weights and Biases). |
| [Kedro](https://github.com/kedro-org/kedro) <sup>↔️</sup> | 10,813 | 2026-04 | `Apache-2.0` | Framework for reproducible, maintainable ML pipelines with clean coding patterns. |
| [Metaflow](https://github.com/Netflix/metaflow) <sup>↔️</sup> | 10,016 | 2026-03 | `Apache-2.0` | Human-centric framework for managing real-life data science and ML projects at scale (Netflix). |
| [Phoenix](https://github.com/Arize-ai/phoenix) <sup>↔️</sup> | 9,201 | 2026-04 | `NOASSERTION` | AI observability platform with OpenTelemetry-native tracing and LLM evaluation dashboards (Arize). |
| [Feast](https://github.com/feast-dev/feast) <sup>↔️</sup> | 6,913 | 2026-03 | `Apache-2.0` | Open-source feature store for managing and serving ML features in real-time and batch inference. |
| [ClearML](https://github.com/clearml/clearml) <sup>↔️</sup> | 6,613 | 2026-03 | `Apache-2.0` | Unified experiment manager, pipeline orchestrator, and data/model management platform. |
| [ZenML](https://github.com/zenml-io/zenml) <sup>↔️</sup> | 5,319 | 2026-03 | `Apache-2.0` | Framework for building portable, production-ready ML pipelines that run on any infrastructure. |
| [Aim](https://github.com/aimhubio/aim) <sup>↔️</sup> | 6,076 | 2025-05 | `Apache-2.0` | Self-hosted experiment tracker with a high-performance UI that handles 10,000+ training runs. |
| *[Kubeflow](https://github.com/kubeflow/kubeflow)* 💤 | *15,558* | *2025-03* | `Apache-2.0` | *ML toolkit on Kubernetes for building portable, scalable ML pipelines and training workflows. **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Related Awesome Lists

| Project | Stars | Updated | License | Description |
|:--------|------:|:--------|:--------|:------------|
| [awesome-machine-learning](https://github.com/josephmisiti/awesome-machine-learning) 🥇 <sup>↔️</sup> | 72,194 | 2026-03 | `NOASSERTION` | Curated list of ML frameworks, libraries, and software organized by language. |
| [awesome-generative-ai](https://github.com/steven2358/awesome-generative-ai) 🥈 <sup>↔️</sup> | 11,775 | 2026-04 | `CC0-1.0` | Curated list of modern generative AI projects and services. |
| [awesome-production-machine-learning](https://github.com/EthicalML/awesome-production-machine-learning) 🥉 <sup>↔️</sup> | 20,347 | 2026-03 | `MIT` | Curated list of tools for deploying, monitoring, and scaling ML in production. |
| [awesome-llm](https://github.com/Hannibal046/Awesome-LLM) <sup>↔️</sup> | 26,613 | 2025-07 | `CC0-1.0` | Curated list of large language model resources covering papers, tools, and applications. |
| [awesome-deep-learning](https://github.com/ChristosChristofidis/awesome-deep-learning) <sup>↔️</sup> | 27,863 | 2025-05 | - | Curated list of deep learning tutorials, projects, and communities. |
| *[awesome-mlops](https://github.com/visenger/awesome-mlops)* 💤 | *13,845* | *2024-11* | - | *Curated list of MLOps tools and best practices for production ML. **Unmaintained - no commits for 12+ months.*** |

**[⬆ Back to Contents](#contents)**

## Papers and Research

<details>
<summary><b>Surveys</b></summary>

- [Automated Machine Learning: Past, Present and Future](https://link.springer.com/article/10.1007/s10462-024-10726-1) - Comprehensive survey covering search spaces, search strategies, HPO, and NAS (2024, Artificial Intelligence Review).
- [AutoML: A Survey of the State-of-the-Art](https://arxiv.org/abs/1908.00709) - Foundational survey on NAS, HPO, and feature engineering that established the modern AutoML taxonomy.
- [Eight Years of AutoML: Categorisation, Review and Trends](https://link.springer.com/article/10.1007/s10115-023-01935-1) - Historical review tracing the evolution of AutoML through 2023 (Knowledge and Information Systems).
- [AutoML to Date and Beyond](https://dl.acm.org/doi/10.1145/3470918) - ACM Computing Surveys overview of open challenges and future directions in AutoML.
- [Advances in Neural Architecture Search](https://academic.oup.com/nsr/article/11/8/nwae282/7740455) - Survey of weight sharing, evaluation estimation, and efficient NAS paradigms (2024, National Science Review).

</details>

<details>
<summary><b>LLM and AutoML</b></summary>

- [AutoML-Agent: A Multi-Agent LLM Framework for Full-Pipeline AutoML](https://arxiv.org/abs/2410.02958) - Multi-agent framework outperforming single-agent approaches across 14 datasets (2025, ICML).
- [AutoML in the Age of Large Language Models](https://openreview.net/forum?id=cAthubStyG) - Analysis of how LLMs reshape AutoML and the symbiotic relationship between them.
- [CAAFE: Context-Aware Automated Feature Engineering](https://arxiv.org/abs/2305.03403) - LLM-powered feature generation improving ROC AUC across 14 datasets (2023, NeurIPS).
- [Large Language Model Agent for Hyper-Parameter Optimization](https://arxiv.org/abs/2402.01881) - Using LLM agents as hyperparameter optimizers via reasoning (2024).
- [LLMs as In-Context Meta-Learners for Model and Hyperparameter Selection](https://arxiv.org/abs/2510.26510) - Prompting LLMs with dataset metadata to recommend algorithms and hyperparameters (2025, NeurIPS).
- [OCTree: Optimized Feature Generation via LLMs with Decision Tree Reasoning](https://proceedings.neurips.cc/paper_files/paper/2024/file/a7ebe2e8d8cfd2fcec6cd77f9e6fd34d-Paper-Conference.pdf) - LLM-driven tabular feature generation guided by decision tree reasoning (2024, NeurIPS).

</details>

<details>
<summary><b>Foundation Models for Data</b></summary>

- [Accurate Predictions on Small Data with a Tabular Foundation Model](https://www.nature.com/articles/s41586-024-08328-6) - TabPFN v2 achieving 100% win rate against default XGBoost on small datasets (2024, Nature).
- [TabPFN-2.5: Advancing the State of the Art](https://arxiv.org/abs/2511.08667) - Scaling to 50K data points with 87% win rate against XGBoost (2025).
- [TabM: Advancing Tabular Deep Learning with Parameter-Efficient Ensembling](https://proceedings.iclr.cc/paper_files/paper/2025/hash/c1ba41c694834aeef91ae161711d4939-Abstract-Conference.html) - BatchEnsemble-based MLP achieving top tabular deep learning performance (2025, ICLR).
- [TABULA-8B: Large Scale Transfer Learning for Tabular Data](https://arxiv.org/abs/2406.12031) - Fine-tuned Llama 3-8B on 2.1B table rows surpassing XGBoost and TabPFN in zero/few-shot settings (2024, NeurIPS).
- [LoCalPFN: Retrieval and Fine-Tuning for In-Context Tabular Models](https://proceedings.neurips.cc/paper_files/paper/2024/hash/c40daf14d7a6469e65116507c21faeb7-Abstract-Conference.html) - Combining retrieval with task-specific fine-tuning to establish new state-of-the-art on 95 OpenML datasets (2024, NeurIPS).
- [Mitra: Mixed Synthetic Priors for Tabular Foundation Models](https://arxiv.org/abs/2510.21204) - Outperforming TabPFNv2 and TabICL across classification and regression (2025, NeurIPS).
- [TabArena: A Living Benchmark for Tabular Data](https://arxiv.org/abs/2506.16791) - Continuously maintained tabular benchmark finding deep learning catches up with ensembling (2025, NeurIPS Spotlight).

</details>

<details>
<summary><b>Automated Prompt Optimization</b></summary>

- [DSPy: Compiling Declarative Language Model Calls](https://arxiv.org/abs/2310.03714) - Programming framework where GPT-3.5 with DSPy outperforms expert prompts by up to 46% (2024, ICLR).
- [TextGrad: Automatic Differentiation via Text](https://arxiv.org/abs/2406.07496) - Backpropagating textual feedback to optimize compound AI systems (2024, Nature).
- [MIPRO: Multi-Stage LM Program Optimization](https://arxiv.org/abs/2406.11695) - Data-aware instruction generation using Bayesian Optimization for multi-stage pipelines (2024).
- [Trace is the Next AutoDiff](https://arxiv.org/abs/2406.16218) - Unified framework treating execution traces as gradients for prompt, HPO, and code optimization (2024, NeurIPS).

</details>

<details>
<summary><b>Neural Architecture Search</b></summary>

- [EvoPrompting: Language Models for Code-Level NAS](https://arxiv.org/abs/2302.14838) - LLMs as mutation operators for evolutionary NAS, outperforming human designs (2023, NeurIPS).
- [FunSearch: Mathematical Discoveries from Program Search](https://www.nature.com/articles/s41586-023-06924-6) - LLM-driven evolutionary program search discovering new mathematical constructions (2024, Nature).
- [RZ-NAS: Enhancing LLM-guided NAS via Reflective Zero-Cost Strategy](https://openreview.net/forum?id=9UExQpH078) - LLMs with training-free zero-cost metrics for efficient architecture search (2025, ICML).

</details>

<details>
<summary><b>Hyperparameter Optimization</b></summary>

- [The Road Less Scheduled](https://proceedings.neurips.cc/paper_files/paper/2024/hash/136b9a13861308c8948cd308ccd02658-Abstract-Conference.html) - Eliminates learning rate schedules entirely; won the MLCommons 2024 AlgoPerf Self-Tuning track (2024, NeurIPS Oral).
- [In-Context Freeze-Thaw Bayesian Optimization](https://arxiv.org/abs/2404.16795) - Transformer-based learning curve extrapolation 10-100x faster than deep GP surrogates (2024, ICML).

</details>

<details>
<summary><b>Automated Data Science Agents</b></summary>

- [The AI Scientist: Fully Automated Scientific Discovery](https://arxiv.org/abs/2408.06292) - First system automating the full research lifecycle from ideation to paper writing (2024, Sakana AI).
- [Data Interpreter: An LLM Agent for Data Science](https://arxiv.org/abs/2402.18679) - Hierarchical graph modeling achieving 0.95 on ML tasks, up from 0.86 baseline (2025, ACL Findings).
- [AIDE: AI-Driven Exploration in the Space of Code](https://arxiv.org/abs/2502.13138) - Tree-search ML agent outperforming 50% of human Kaggle competitors (2025).
- [OpenHands: An Open Platform for AI Software Developers](https://arxiv.org/abs/2407.16741) - Open platform achieving 53% on SWE-Bench Verified (2024).
- [DS-Agent: Automated Data Science by Empowering LLMs with Case-Based Reasoning](https://arxiv.org/abs/2402.17453) - LLM agents with case-based reasoning from Kaggle expert knowledge for automated ML model building (2024, ICML).
- [MLR-Bench: Evaluating AI Agents on Open-Ended ML Research](https://arxiv.org/abs/2505.19955) - 201 research tasks revealing agents fabricate experimental results in ~80% of cases (2025, NeurIPS).

</details>

<details>
<summary><b>AutoML Benchmarks</b></summary>

- [AMLB: An AutoML Benchmark](https://arxiv.org/abs/2207.12560) - Standard evaluation framework comparing 9 AutoML systems across 104 tasks (2024, JMLR).
- [MLE-bench: Evaluating ML Agents on ML Engineering](https://arxiv.org/abs/2410.07095) - 75 Kaggle competitions as benchmark for ML engineering agents (2024, OpenAI).
- [MLAgentBench: Evaluating Language Agents on ML Experimentation](https://arxiv.org/abs/2310.03302) - 13 ML tasks revealing long-term planning as key challenge for agents (2024, ICML).
- [MLGym: A New Framework for ML Research Agents](https://arxiv.org/abs/2502.14499) - First Gym environment showing agents find hyperparameters but struggle with novel hypotheses (2025, Meta).

</details>

<details>
<summary><b>Meta-Learning</b></summary>

- [SML-AutoML: A Smart Meta-Learning AutoML Framework](https://www.oajaiml.com/uploads/archivepdf/134544176.pdf) - Integrating meta-learning from past pipeline performance for 5%+ improvement over baselines (2024).
- [PriorBand: Practical HPO in the Age of Deep Learning](https://arxiv.org/abs/2306.12370) - Using expert beliefs and cheap proxy tasks for efficient optimization in 10 training runs (2023, NeurIPS).

</details>

**[⬆ Back to Contents](#contents)**

## Books and Courses

- [Automated Machine Learning (Springer)](https://www.automl.org/book/) - The definitive AutoML textbook by Hutter, Kotthoff, and Vanschoren covering methods, systems, and challenges.
- [MIT EfficientML.ai](https://efficientml.ai/) - Course on efficient ML and neural architecture search by Song Han at MIT.
- [AutoML.org](https://www.automl.org/) - Research portal and resources from the AutoML group at University of Freiburg and Leibniz University Hannover.

**[⬆ Back to Contents](#contents)**

## Conferences and Communities

- [AutoML Conference](https://automl.cc/) - Annual conference dedicated to AutoML research. 2025: New York City, 2026: Ljubljana.
- [OpenML](https://www.openml.org/) - Open science platform for sharing ML experiments, datasets, tasks, and flows.
- [Papers With Code](https://paperswithcode.com/) - Community linking research papers with their official code implementations and benchmark results.
- [MLE-Bench Leaderboard](https://mle-bench.github.io/) - Public leaderboard for ML engineering agents competing on Kaggle tasks.

**[⬆ Back to Contents](#contents)**

## Contributing

Contributions welcome! Read the [contributing guidelines](contributing.md) first.
