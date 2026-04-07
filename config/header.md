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
- [Hyperparameter Optimization](#hyperparameter-optimization) (8)
- [Automated Feature Engineering](#automated-feature-engineering) (8)
- [AutoML Benchmarks](#automl-benchmarks) (5)

**AI-Native AutoML**
- [Foundation Models as AutoML](#foundation-models-as-automl) (8)
- [Automated Fine-Tuning](#automated-fine-tuning) (10)
- [Automated Prompt Optimization](#automated-prompt-optimization) (9)
- [Automated AI Research](#automated-ai-research) (10)
- [ML Engineering Agents](#ml-engineering-agents) (5)

**LLM Operations**
- [LLM Evaluation and Testing](#llm-evaluation-and-testing) (10)
- [LLM Routing and Selection](#llm-routing-and-selection) (4)

**ML Lifecycle Automation**
- [Time-Series AutoML](#time-series-automl) (13)
- [Automated Data Preprocessing](#automated-data-preprocessing) (7)
- [Automated Data Labeling](#automated-data-labeling) (6)
- [Synthetic Data Generation](#synthetic-data-generation) (4)
- [Automated Model Compression](#automated-model-compression) (6)
- [Automated Deployment and Serving](#automated-deployment-and-serving) (13)
- [Automated Monitoring and Observability](#automated-monitoring-and-observability) (6)
- [Automated AI Safety](#automated-ai-safety) (5)
- [MLOps and Experiment Tracking](#mlops-and-experiment-tracking) (16)

**Resources**
- [Papers and Research](#papers-and-research)
- [Books and Courses](#books-and-courses) (3)
- [Conferences and Communities](#conferences-and-communities) (4)
- [Related Awesome Lists](#related-awesome-lists) (6)

### Legend

| Symbol | Meaning |
|:-------|:--------|
| 5,200 | GitHub stars (updates on each `generate` run) |
| 2026-03 | Last commit date as YYYY-MM |
| **Unmaintained** | No meaningful commits for 12+ months |
| **Archived** | Repository archived by maintainer |
| **Deprecated** | Superseded; named replacement provided |
| **Historical** | Included for foundational influence, not active use |
| **Low activity** | Infrequent updates but not abandoned |

### Quick Comparison: General-Purpose AutoML

| Framework | Stars | Updated | Best For | Modalities |
|:----------|:------|:--------|:---------|:-----------|
| [Ludwig](https://github.com/ludwig-ai/ludwig) | ![](https://img.shields.io/github/stars/ludwig-ai/ludwig?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ludwig-ai/ludwig?style=flat-square&label=&color=green) | Declarative deep learning | Tabular, text, image |
| [AutoGluon](https://github.com/autogluon/autogluon) | ![](https://img.shields.io/github/stars/autogluon/autogluon?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/autogluon/autogluon?style=flat-square&label=&color=green) | Overall accuracy | Tabular, text, image, TS |
| [TPOT](https://github.com/EpistasisLab/tpot) | ![](https://img.shields.io/github/stars/EpistasisLab/tpot?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/EpistasisLab/tpot?style=flat-square&label=&color=green) | Pipeline discovery | Tabular (sklearn) |
| [PyCaret](https://github.com/pycaret/pycaret) | ![](https://img.shields.io/github/stars/pycaret/pycaret?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/pycaret/pycaret?style=flat-square&label=&color=green) | Quick prototyping | Tabular |
| [AutoKeras](https://github.com/keras-team/autokeras) | ![](https://img.shields.io/github/stars/keras-team/autokeras?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/keras-team/autokeras?style=flat-square&label=&color=green) | Deep learning | Image, text, tabular |
| [H2O AutoML](https://github.com/h2oai/h2o-3) | ![](https://img.shields.io/github/stars/h2oai/h2o-3?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/h2oai/h2o-3?style=flat-square&label=&color=green) | Enterprise / distributed | Tabular |
| [FLAML](https://github.com/microsoft/FLAML) | ![](https://img.shields.io/github/stars/microsoft/FLAML?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/microsoft/FLAML?style=flat-square&label=&color=green) | Resource-constrained | Tabular |
| [MLJAR](https://github.com/mljar/mljar-supervised) | ![](https://img.shields.io/github/stars/mljar/mljar-supervised?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/mljar/mljar-supervised?style=flat-square&label=&color=green) | Explainability | Tabular |

