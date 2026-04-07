<div align="center">

# Awesome AutoML [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

**The comprehensive guide to automating AI/ML** - from classical AutoML to LLM-powered agents<br>that build, optimize, and ship ML systems autonomously.

[![Views](https://hits.sh/github.com/jbogocz/awesome-automl.svg?style=flat-square&label=views)](https://hits.sh/github.com/jbogocz/awesome-automl/)
[![GitHub stars](https://img.shields.io/github/stars/jbogocz/awesome-automl?style=flat-square)](https://github.com/jbogocz/awesome-automl/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/jbogocz/awesome-automl?style=flat-square)](https://github.com/jbogocz/awesome-automl/commits)
[![License: CC0 + MIT](https://img.shields.io/badge/license-CC0_+_MIT-green?style=flat-square)](LICENSE)
[![Tools](https://img.shields.io/badge/tools-250+-blue?style=flat-square)](#contents)

</div>

<div align="center">

### **[Explore interactively →](https://jbogocz.github.io/awesome-automl)**

250+ tools and papers across 25 categories

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
| ![](https://img.shields.io/badge/stars-5.2k-blue?style=flat-square) | GitHub stars - auto-updates on every page view |
| ![](https://img.shields.io/badge/updated-3_days_ago-green?style=flat-square) | Last commit - auto-updates on every page view |
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

## General-Purpose AutoML

*End-to-end frameworks that automate model selection, hyperparameter tuning, and pipeline construction.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Ludwig](https://github.com/ludwig-ai/ludwig) | ![](https://img.shields.io/github/stars/ludwig-ai/ludwig?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ludwig-ai/ludwig?style=flat-square&label=&color=green) | Declarative deep learning framework supporting custom model building and LLM fine-tuning via YAML configs. Now under Linux Foundation AI & Data. |
| [AutoGluon](https://github.com/autogluon/autogluon) | ![](https://img.shields.io/github/stars/autogluon/autogluon?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/autogluon/autogluon?style=flat-square&label=&color=green) | Multi-layer stack ensembling for tabular, text, image, time-series, and multimodal data - won medals in 15/18 Kaggle tabular contests in 2024 (Amazon). |
| [TPOT](https://github.com/EpistasisLab/tpot) | ![](https://img.shields.io/github/stars/EpistasisLab/tpot?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/EpistasisLab/tpot?style=flat-square&label=&color=green) | Genetic programming-based pipeline optimizer that designs and optimizes scikit-learn pipelines. |
| [PyCaret](https://github.com/pycaret/pycaret) | ![](https://img.shields.io/github/stars/pycaret/pycaret?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/pycaret/pycaret?style=flat-square&label=&color=green) | Low-code machine learning library that automates model training, tuning, and deployment workflows in Python. |
| [AutoKeras](https://github.com/keras-team/autokeras) | ![](https://img.shields.io/github/stars/keras-team/autokeras?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/keras-team/autokeras?style=flat-square&label=&color=green) | Neural architecture search for deep learning models built on top of Keras. |
| [auto-sklearn](https://github.com/automl/auto-sklearn) | ![](https://img.shields.io/github/stars/automl/auto-sklearn?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/automl/auto-sklearn?style=flat-square&label=&color=green) | Historically important AutoML toolkit using Bayesian optimization, meta-learning, and ensemble construction. **Unmaintained since Sep 2022; broken on Python 3.10+.** |
| [H2O AutoML](https://github.com/h2oai/h2o-3) | ![](https://img.shields.io/github/stars/h2oai/h2o-3?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/h2oai/h2o-3?style=flat-square&label=&color=green) | Distributed machine learning platform with automatic training and tuning of many models within a user-specified time limit. |
| [FLAML](https://github.com/microsoft/FLAML) | ![](https://img.shields.io/github/stars/microsoft/FLAML?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/microsoft/FLAML?style=flat-square&label=&color=green) | Fast and lightweight AutoML that finds good models with minimal resources - often the best choice for resource-constrained environments (Microsoft). |
| [LazyPredict](https://github.com/shankarpandala/lazypredict) | ![](https://img.shields.io/github/stars/shankarpandala/lazypredict?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/shankarpandala/lazypredict?style=flat-square&label=&color=green) | Build and evaluate dozens of scikit-learn models in a single line of code for rapid baseline comparison. **Low activity since 2022.** |
| [MLJAR Supervised](https://github.com/mljar/mljar-supervised) | ![](https://img.shields.io/github/stars/mljar/mljar-supervised?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/mljar/mljar-supervised?style=flat-square&label=&color=green) | Automated ML with automatic explanations, visualizations, and Markdown reports for every trained model. |
| [LightAutoML](https://github.com/sb-ai-lab/LightAutoML) | ![](https://img.shields.io/github/stars/sb-ai-lab/LightAutoML?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/sb-ai-lab/LightAutoML?style=flat-square&label=&color=green) | Fast and customizable AutoML framework with Kaggle-winning performance (Sber AI Lab). |
| [EvalML](https://github.com/alteryx/evalml) | ![](https://img.shields.io/github/stars/alteryx/evalml?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/alteryx/evalml?style=flat-square&label=&color=green) | AutoML library for building, optimizing, and evaluating ML pipelines with domain-specific objectives (Alteryx). |
| [SapientML](https://github.com/sapientml/sapientml) | ![](https://img.shields.io/github/stars/sapientml/sapientml?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/sapientml/sapientml?style=flat-square&label=&color=green) | Generative AutoML that synthesizes pipelines by learning from a corpus of existing ML solutions. |
| [Auto-WEKA](https://github.com/automl/autoweka) | ![](https://img.shields.io/github/stars/automl/autoweka?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/automl/autoweka?style=flat-square&label=&color=green) | The original AutoML system (2013) combining algorithm selection and HPO in WEKA. **Historical; Java-only, maintenance mode.** |
| [GAMA](https://github.com/amore-labs/gama) | ![](https://img.shields.io/github/stars/amore-labs/gama?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/amore-labs/gama?style=flat-square&label=&color=green) | AutoML tool that generates optimized ML pipelines using genetic programming and Bayesian optimization (OpenML). **Unmaintained — no commits for 12+ months.** |

**[⬆ Back to Contents](#contents)**

## Foundation Models as AutoML

*Pretrained models that replace traditional pipeline-search AutoML with a single forward pass or zero-shot inference.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [TimesFM](https://github.com/google-research/timesfm) | ![](https://img.shields.io/github/stars/google-research/timesfm?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/google-research/timesfm?style=flat-square&label=&color=green) | Time-series foundation model for zero-shot forecasting across domains without task-specific training (Google). |
| [TabPFN](https://github.com/PriorLabs/TabPFN) | ![](https://img.shields.io/github/stars/PriorLabs/TabPFN?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/PriorLabs/TabPFN?style=flat-square&label=&color=green) | Tabular foundation model that matches tuned XGBoost in 2.8 seconds with a single forward pass - 100% win rate vs default XGBoost on datasets under 10K rows (Nature 2024, now v2.6 supporting up to 100K rows). |
| [Chronos](https://github.com/amazon-science/chronos-forecasting) | ![](https://img.shields.io/github/stars/amazon-science/chronos-forecasting?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/amazon-science/chronos-forecasting?style=flat-square&label=&color=green) | Pretrained time-series foundation model for zero-shot probabilistic forecasting on unseen data (Amazon). |
| [Moirai](https://github.com/SalesforceAIResearch/uni2ts) | ![](https://img.shields.io/github/stars/SalesforceAIResearch/uni2ts?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/SalesforceAIResearch/uni2ts?style=flat-square&label=&color=green) | Universal time-series forecasting transformer supporting multivariate forecasting unlike most competitors. Moirai-MoE released Oct 2024 (Salesforce). |
| [TabM](https://github.com/yandex-research/tabm) | ![](https://img.shields.io/github/stars/yandex-research/tabm?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/yandex-research/tabm?style=flat-square&label=&color=green) | Parameter-efficient ensemble of MLPs based on BatchEnsemble, achieving top performance among tabular deep learning models without attention complexity (ICLR 2025, Yandex). |
| [TALENT](https://github.com/LAMDA-Tabular/TALENT) | ![](https://img.shields.io/github/stars/LAMDA-Tabular/TALENT?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/LAMDA-Tabular/TALENT?style=flat-square&label=&color=green) | Comprehensive toolkit and benchmark for tabular learning covering 35+ deep methods across 300 datasets. |
| [TabICL](https://github.com/soda-inria/tabicl) | ![](https://img.shields.io/github/stars/soda-inria/tabicl?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/soda-inria/tabicl?style=flat-square&label=&color=green) | State-of-the-art tabular foundation model achieving 10x faster inference than TabPFN v2.5 (ICML 2025). |
| [CARTE](https://github.com/soda-inria/carte) | ![](https://img.shields.io/github/stars/soda-inria/carte?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/soda-inria/carte?style=flat-square&label=&color=green) | Context-aware tabular representation using pretrained language models for data with heterogeneous columns. |

**[⬆ Back to Contents](#contents)**

## Automated Fine-Tuning

*Tools that automate the process of adapting large language models to specific tasks and domains.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [LLaMA-Factory](https://github.com/hiyouga/LlamaFactory) | ![](https://img.shields.io/github/stars/hiyouga/LlamaFactory?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/hiyouga/LlamaFactory?style=flat-square&label=&color=green) | Unified fine-tuning framework for 100+ LLMs and VLMs with Full, LoRA, QLoRA, and DoRA methods plus web UI (ACL 2024). |
| [Unsloth](https://github.com/unslothai/unsloth) | ![](https://img.shields.io/github/stars/unslothai/unsloth?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/unslothai/unsloth?style=flat-square&label=&color=green) | Fine-tune LLMs 2-5x faster with 80% less memory on a single GPU through optimized kernels and custom autograd. |
| [PEFT](https://github.com/huggingface/peft) | ![](https://img.shields.io/github/stars/huggingface/peft?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/huggingface/peft?style=flat-square&label=&color=green) | Standard library for parameter-efficient fine-tuning - LoRA, QLoRA, Spectrum, and more. Deeply integrated with the Hugging Face ecosystem. |
| [TRL](https://github.com/huggingface/trl) | ![](https://img.shields.io/github/stars/huggingface/trl?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/huggingface/trl?style=flat-square&label=&color=green) | Transformer Reinforcement Learning with SFT, DPO, RLHF, and GRPO trainers for alignment and preference tuning (Hugging Face). |
| [LitGPT](https://github.com/Lightning-AI/litgpt) | ![](https://img.shields.io/github/stars/Lightning-AI/litgpt?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Lightning-AI/litgpt?style=flat-square&label=&color=green) | Recipes for pretraining, fine-tuning, and deploying 20+ LLM architectures on your own data (Lightning AI). |
| [Axolotl](https://github.com/axolotl-ai-cloud/axolotl) | ![](https://img.shields.io/github/stars/axolotl-ai-cloud/axolotl?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/axolotl-ai-cloud/axolotl?style=flat-square&label=&color=green) | Production-grade fine-tuning with multi-GPU support, sequence parallelism, and multimodal capabilities. |
| [LMFlow](https://github.com/OptimalScale/LMFlow) | ![](https://img.shields.io/github/stars/OptimalScale/LMFlow?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/OptimalScale/LMFlow?style=flat-square&label=&color=green) | Extensible toolkit for fine-tuning and inference of large foundation models, NAACL 2024 Best Demo Award. |
| [torchtune](https://github.com/meta-pytorch/torchtune) | ![](https://img.shields.io/github/stars/meta-pytorch/torchtune?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/meta-pytorch/torchtune?style=flat-square&label=&color=green) | Native PyTorch library for fine-tuning LLMs with composable building blocks and YAML configs (Meta). |
| [Hugging Face AutoTrain](https://github.com/huggingface/autotrain-advanced) | ![](https://img.shields.io/github/stars/huggingface/autotrain-advanced?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/huggingface/autotrain-advanced?style=flat-square&label=&color=green) | No-code training for LLMs, vision-language models, text classification, and tabular data (Hugging Face). |
| [LoRAX](https://github.com/predibase/lorax) | ![](https://img.shields.io/github/stars/predibase/lorax?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/predibase/lorax?style=flat-square&label=&color=green) | Multi-LoRA inference server that scales to thousands of fine-tuned LLMs on a single GPU (Predibase). |

**[⬆ Back to Contents](#contents)**

## Automated Prompt Optimization

*Systematic optimization of prompts, instructions, and demonstrations to improve LLM performance without manual tuning.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [DSPy](https://github.com/stanfordnlp/dspy) | ![](https://img.shields.io/github/stars/stanfordnlp/dspy?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/stanfordnlp/dspy?style=flat-square&label=&color=green) | Declarative framework replacing hand-written prompts with automatic optimizers - GPT-3.5 with DSPy outperforms expert prompts by up to 46% (Stanford NLP). |
| [PromptWizard](https://github.com/microsoft/PromptWizard) | ![](https://img.shields.io/github/stars/microsoft/PromptWizard?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/microsoft/PromptWizard?style=flat-square&label=&color=green) | Task-aware agent-driven prompt optimization using self-evolving critique and synthesis (Microsoft). |
| [TextGrad](https://github.com/zou-group/textgrad) | ![](https://img.shields.io/github/stars/zou-group/textgrad?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/zou-group/textgrad?style=flat-square&label=&color=green) | Automatic differentiation via text feedback, enabling gradient-like optimization of compound AI systems (Nature 2024). |
| [GEPA](https://github.com/gepa-ai/gepa) | ![](https://img.shields.io/github/stars/gepa-ai/gepa?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/gepa-ai/gepa?style=flat-square&label=&color=green) | Reflective text evolution for prompt, code, and text optimization, integrated into MLflow (Cerebras). |
| [AutoPrompt](https://github.com/Eladlev/AutoPrompt) | ![](https://img.shields.io/github/stars/Eladlev/AutoPrompt?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Eladlev/AutoPrompt?style=flat-square&label=&color=green) | Intent-based prompt calibration using synthetic data generation for iterative prompt refinement. |
| [Mirascope](https://github.com/Mirascope/mirascope) | ![](https://img.shields.io/github/stars/Mirascope/mirascope?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Mirascope/mirascope?style=flat-square&label=&color=green) | Pythonic toolkit for building LLM applications with integrated prompt versioning, tracing, and optimization. |
| [Promptomatix](https://github.com/SalesforceAIResearch/promptomatix) | ![](https://img.shields.io/github/stars/SalesforceAIResearch/promptomatix?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/SalesforceAIResearch/promptomatix?style=flat-square&label=&color=green) | DSPy-powered automatic prompt optimization that transforms task descriptions into optimized prompts with cost-aware objectives (Salesforce). |
| [Prompt-Ops](https://github.com/meta-llama/prompt-ops) | ![](https://img.shields.io/github/stars/meta-llama/prompt-ops?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/meta-llama/prompt-ops?style=flat-square&label=&color=green) | Open-source command-line tool for building, optimizing, and managing prompts at scale (Meta). |
| [EvoPrompt](https://github.com/beeevita/EvoPrompt) | ![](https://img.shields.io/github/stars/beeevita/EvoPrompt?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/beeevita/EvoPrompt?style=flat-square&label=&color=green) | Connects LLMs with evolutionary algorithms for discrete prompt optimization with up to 25% improvement over manual prompts. |

**[⬆ Back to Contents](#contents)**

## Automated AI Research

*Autonomous systems that design experiments, run them, and analyze results without human intervention.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [AutoResearch](https://github.com/karpathy/autoresearch) | ![](https://img.shields.io/github/stars/karpathy/autoresearch?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/karpathy/autoresearch?style=flat-square&label=&color=green) | Minimal script enabling AI agents to autonomously run ~100 ML experiments overnight at ~12/hour, finding genuine improvements that transfer to larger models (Karpathy, March 2026). |
| [AutoGen](https://github.com/microsoft/autogen) | ![](https://img.shields.io/github/stars/microsoft/autogen?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/microsoft/autogen?style=flat-square&label=&color=green) | Multi-agent conversation framework for building AI agent systems. Now in maintenance mode as AG2 (Microsoft). |
| [CrewAI](https://github.com/crewAIInc/crewAI) | ![](https://img.shields.io/github/stars/crewAIInc/crewAI?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/crewAIInc/crewAI?style=flat-square&label=&color=green) | Multi-agent framework orchestrating role-playing specialist agents for complex AI workflows. |
| [STORM](https://github.com/stanford-oval/storm) | ![](https://img.shields.io/github/stars/stanford-oval/storm?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/stanford-oval/storm?style=flat-square&label=&color=green) | LLM-powered knowledge curation that researches topics and generates full articles with citations (Stanford). |
| [AI-Scientist](https://github.com/SakanaAI/AI-Scientist) | ![](https://img.shields.io/github/stars/SakanaAI/AI-Scientist?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/SakanaAI/AI-Scientist?style=flat-square&label=&color=green) | Fully automated open-ended scientific discovery from idea generation to experiment execution to paper writing (Sakana AI). |
| [PaperQA](https://github.com/Future-House/paper-qa) | ![](https://img.shields.io/github/stars/Future-House/paper-qa?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Future-House/paper-qa?style=flat-square&label=&color=green) | High-accuracy retrieval-augmented generation for answering questions from scientific literature. |
| [AI-Scientist-v2](https://github.com/SakanaAI/AI-Scientist-v2) | ![](https://img.shields.io/github/stars/SakanaAI/AI-Scientist-v2?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/SakanaAI/AI-Scientist-v2?style=flat-square&label=&color=green) | Second generation using agentic tree search, producing the first AI-generated paper accepted at a peer-reviewed workshop. |
| [AI-Researcher](https://github.com/HKUDS/AI-Researcher) | ![](https://img.shields.io/github/stars/HKUDS/AI-Researcher?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/HKUDS/AI-Researcher?style=flat-square&label=&color=green) | Autonomous agent automating the full research lifecycle from literature review to experimentation (NeurIPS 2025 Spotlight). |
| [AIDE](https://github.com/WecoAI/aideml) | ![](https://img.shields.io/github/stars/WecoAI/aideml?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/WecoAI/aideml?style=flat-square&label=&color=green) | ML engineering agent using tree search over solution space - exceeds 50% of human Kaggle competitors; top agents using AIDE achieve medals in 64%+ of MLE-Bench competitions (Weco AI). |
| [AutoML-Agent](https://github.com/DeepAuto-AI/automl-agent) | ![](https://img.shields.io/github/stars/DeepAuto-AI/automl-agent?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/DeepAuto-AI/automl-agent?style=flat-square&label=&color=green) | Multi-agent LLM framework for full-pipeline AutoML from data retrieval through model deployment (ICML 2025). |

**[⬆ Back to Contents](#contents)**

## ML Engineering Agents

*AI agents that autonomously write, debug, and optimize code for software and ML engineering.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [OpenHands](https://github.com/OpenHands/OpenHands) | ![](https://img.shields.io/github/stars/OpenHands/OpenHands?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/OpenHands/OpenHands?style=flat-square&label=&color=green) | AI software development platform achieving 53-72% resolve rate on SWE-Bench Verified. |
| [Aider](https://github.com/Aider-AI/aider) | ![](https://img.shields.io/github/stars/Aider-AI/aider?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Aider-AI/aider?style=flat-square&label=&color=green) | AI pair programmer in the terminal that edits code directly in your local repository. |
| [SWE-agent](https://github.com/SWE-agent/SWE-agent) | ![](https://img.shields.io/github/stars/SWE-agent/SWE-agent?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/SWE-agent/SWE-agent?style=flat-square&label=&color=green) | Autonomous agent that solves real GitHub issues by reading, editing, and testing code (NeurIPS 2024). |
| [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) | ![](https://img.shields.io/github/stars/SWE-agent/mini-swe-agent?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/SWE-agent/mini-swe-agent?style=flat-square&label=&color=green) | Minimalist 100-line coding agent achieving 74% on SWE-bench Verified as a learning reference. |
| [AutoCodeRover](https://github.com/AutoCodeRoverSG/auto-code-rover) | ![](https://img.shields.io/github/stars/AutoCodeRoverSG/auto-code-rover?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/AutoCodeRoverSG/auto-code-rover?style=flat-square&label=&color=green) | Structure-aware autonomous program repair combining code search with LLM-based patching. |

**[⬆ Back to Contents](#contents)**

## LLM Evaluation and Testing

*Frameworks for automated evaluation, testing, and benchmarking of language models and AI systems.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Promptfoo](https://github.com/promptfoo/promptfoo) | ![](https://img.shields.io/github/stars/promptfoo/promptfoo?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/promptfoo/promptfoo?style=flat-square&label=&color=green) | Test and red-team LLM applications with automated evaluations, CI/CD integration, and vulnerability scanning. |
| [DeepEval](https://github.com/confident-ai/deepeval) | ![](https://img.shields.io/github/stars/confident-ai/deepeval?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/confident-ai/deepeval?style=flat-square&label=&color=green) | Pytest-like framework with 14+ evaluation metrics for RAG, fine-tuning, and alignment assessment. |
| [RAGAS](https://github.com/vibrantlabsai/ragas) | ![](https://img.shields.io/github/stars/vibrantlabsai/ragas?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/vibrantlabsai/ragas?style=flat-square&label=&color=green) | Evaluation framework for RAG quality assessment measuring both retrieval and generation with LLM-based and traditional metrics. |
| [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) | ![](https://img.shields.io/github/stars/EleutherAI/lm-evaluation-harness?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/EleutherAI/lm-evaluation-harness?style=flat-square&label=&color=green) | Standard framework for few-shot evaluation of language models across hundreds of benchmarks (EleutherAI). |
| [OpenCompass](https://github.com/open-compass/opencompass) | ![](https://img.shields.io/github/stars/open-compass/opencompass?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/open-compass/opencompass?style=flat-square&label=&color=green) | One-stop evaluation platform supporting 100+ models across academic and real-world benchmarks. |
| [Agenta](https://github.com/Agenta-AI/agenta) | ![](https://img.shields.io/github/stars/Agenta-AI/agenta?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Agenta-AI/agenta?style=flat-square&label=&color=green) | Open-source LLMOps platform combining prompt playground, evaluation workflows, and production observability. |
| [TruLens](https://github.com/truera/trulens) | ![](https://img.shields.io/github/stars/truera/trulens?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/truera/trulens?style=flat-square&label=&color=green) | OpenTelemetry-based tracing and evaluation for RAG and agent workflows with built-in feedback functions (Snowflake/TruEra). |
| [LangWatch](https://github.com/langwatch/langwatch) | ![](https://img.shields.io/github/stars/langwatch/langwatch?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/langwatch/langwatch?style=flat-square&label=&color=green) | Evaluation and testing platform for LLM applications and AI agents with automated quality guardrails. |
| [LightEval](https://github.com/huggingface/lighteval) | ![](https://img.shields.io/github/stars/huggingface/lighteval?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/huggingface/lighteval?style=flat-square&label=&color=green) | All-in-one LLM evaluation toolkit powering the Open LLM Leaderboard, supporting 1000+ tasks across multiple backends (Hugging Face). |
| [Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai) | ![](https://img.shields.io/github/stars/UKGovernmentBEIS/inspect_ai?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/UKGovernmentBEIS/inspect_ai?style=flat-square&label=&color=green) | Framework for reproducible LLM evals with sandboxed agent execution, 100+ prebuilt evaluations, and VS Code integration (UK AI Safety Institute). |

**[⬆ Back to Contents](#contents)**

## LLM Routing and Selection

*Intelligent routing of requests to the optimal model based on task complexity, cost, and performance.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [LiteLLM](https://github.com/BerriAI/litellm) | ![](https://img.shields.io/github/stars/BerriAI/litellm?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/BerriAI/litellm?style=flat-square&label=&color=green) | Unified API gateway for 100+ LLMs with load balancing, cost tracking, and automatic fallback routing. |
| [Portkey Gateway](https://github.com/Portkey-AI/gateway) | ![](https://img.shields.io/github/stars/Portkey-AI/gateway?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Portkey-AI/gateway?style=flat-square&label=&color=green) | AI gateway for intelligent routing, caching, load balancing, and fallbacks across 200+ LLMs. |
| [RouteLLM](https://github.com/lm-sys/RouteLLM) | ![](https://img.shields.io/github/stars/lm-sys/RouteLLM?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/lm-sys/RouteLLM?style=flat-square&label=&color=green) | Framework for training and serving LLM routers that reduce costs by up to 85% without quality loss (LMSYS). **Unmaintained — no commits for 12+ months.** |
| [LLMRouter](https://github.com/ulab-uiuc/LLMRouter) | ![](https://img.shields.io/github/stars/ulab-uiuc/LLMRouter?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ulab-uiuc/LLMRouter?style=flat-square&label=&color=green) | Unified library with 16+ router implementations and standardized evaluation via command-line interface. |

**[⬆ Back to Contents](#contents)**

## Time-Series AutoML

*Automated forecasting, classification, and anomaly detection for temporal data.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [sktime](https://github.com/sktime/sktime) | ![](https://img.shields.io/github/stars/sktime/sktime?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/sktime/sktime?style=flat-square&label=&color=green) | Unified framework for time-series forecasting, classification, regression, and clustering with scikit-learn-compatible interfaces. |
| [Darts](https://github.com/unit8co/darts) | ![](https://img.shields.io/github/stars/unit8co/darts?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/unit8co/darts?style=flat-square&label=&color=green) | Unified API for 30+ forecasting models from ARIMA to transformers, with backtesting and ensembling built in. |
| [Nixtla StatsForecast](https://github.com/Nixtla/statsforecast) | ![](https://img.shields.io/github/stars/Nixtla/statsforecast?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Nixtla/statsforecast?style=flat-square&label=&color=green) | Lightning-fast statistical models including AutoARIMA, AutoETS, and AutoCES for millions of time series. |
| [Merlion](https://github.com/salesforce/Merlion) | ![](https://img.shields.io/github/stars/salesforce/Merlion?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/salesforce/Merlion?style=flat-square&label=&color=green) | Time-series intelligence library with unified interfaces for forecasting, anomaly detection, and change-point detection (Salesforce). **Archived.** |
| [Nixtla NeuralForecast](https://github.com/Nixtla/neuralforecast) | ![](https://img.shields.io/github/stars/Nixtla/neuralforecast?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Nixtla/neuralforecast?style=flat-square&label=&color=green) | Production-ready neural forecasting with 30+ state-of-the-art models including N-BEATS, TFT, and PatchTST. |
| [PyPOTS](https://github.com/WenjieDu/PyPOTS) | ![](https://img.shields.io/github/stars/WenjieDu/PyPOTS?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/WenjieDu/PyPOTS?style=flat-square&label=&color=green) | Toolbox with 50+ deep learning models for partially-observed time-series imputation, classification, and clustering. |
| [Lag-Llama](https://github.com/time-series-foundation-models/lag-llama) | ![](https://img.shields.io/github/stars/time-series-foundation-models/lag-llama?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/time-series-foundation-models/lag-llama?style=flat-square&label=&color=green) | First open-source foundation model for univariate probabilistic time-series forecasting based on a decoder-only transformer (NeurIPS 2024). |
| [skforecast](https://github.com/skforecast/skforecast) | ![](https://img.shields.io/github/stars/skforecast/skforecast?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/skforecast/skforecast?style=flat-square&label=&color=green) | Scikit-learn-compatible multi-step forecasting with XGBoost, LightGBM, CatBoost, and feature engineering utilities. |
| [AutoTS](https://github.com/winedarksea/AutoTS) | ![](https://img.shields.io/github/stars/winedarksea/AutoTS?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/winedarksea/AutoTS?style=flat-square&label=&color=green) | Genetic algorithm-based automated model selection, ensembling, and anomaly detection for time-series data. |
| [aeon](https://github.com/aeon-toolkit/aeon) | ![](https://img.shields.io/github/stars/aeon-toolkit/aeon?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/aeon-toolkit/aeon?style=flat-square&label=&color=green) | Next-generation time-series ML toolkit for classification, regression, clustering, and anomaly detection. |
| [Nixtla MLForecast](https://github.com/Nixtla/mlforecast) | ![](https://img.shields.io/github/stars/Nixtla/mlforecast?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Nixtla/mlforecast?style=flat-square&label=&color=green) | Scalable ML-based forecasting with LightGBM, XGBoost, and distributed backends via Dask, Spark, and Ray. |
| [Time-MoE](https://github.com/Time-MoE/Time-MoE) | ![](https://img.shields.io/github/stars/Time-MoE/Time-MoE?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Time-MoE/Time-MoE?style=flat-square&label=&color=green) | First billion-scale time-series foundation model using sparse mixture-of-experts, trained on 300B+ time points (ICLR 2025 Spotlight). |
| [Granite-TSFM](https://github.com/ibm-granite/granite-tsfm) | ![](https://img.shields.io/github/stars/ibm-granite/granite-tsfm?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ibm-granite/granite-tsfm?style=flat-square&label=&color=green) | Compact pretrained Tiny Time Mixers that rival billion-parameter models for zero/few-shot multivariate forecasting (IBM, NeurIPS 2024). |

**[⬆ Back to Contents](#contents)**

## Neural Architecture Search

*Automated design and discovery of optimal neural network architectures.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [NNI](https://github.com/microsoft/nni) | ![](https://img.shields.io/github/stars/microsoft/nni?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/microsoft/nni?style=flat-square&label=&color=green) | Comprehensive AutoML toolkit for NAS, hyperparameter tuning, feature engineering, and model compression. **Archived by Microsoft in Sep 2024.** |
| [Google AutoML](https://github.com/google/automl) | ![](https://img.shields.io/github/stars/google/automl?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/google/automl?style=flat-square&label=&color=green) | Research code for EfficientNet, EfficientDet, MnasNet, and other NAS-discovered architectures (Google Brain). **Unmaintained — no commits for 12+ months.** |
| [Once-For-All](https://github.com/mit-han-lab/once-for-all) | ![](https://img.shields.io/github/stars/mit-han-lab/once-for-all?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/mit-han-lab/once-for-all?style=flat-square&label=&color=green) | Train one network and specialize sub-networks for diverse hardware without retraining (MIT HAN Lab, ICLR 2020). **Unmaintained — no commits for 12+ months.** |
| [TinyEngine](https://github.com/mit-han-lab/tinyengine) | ![](https://img.shields.io/github/stars/mit-han-lab/tinyengine?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/mit-han-lab/tinyengine?style=flat-square&label=&color=green) | Memory-efficient inference engine for NAS-optimized models on microcontrollers (MIT HAN Lab). **Unmaintained — no commits for 12+ months.** |
| [Vega](https://github.com/huawei-noah/vega) | ![](https://img.shields.io/github/stars/huawei-noah/vega?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/huawei-noah/vega?style=flat-square&label=&color=green) | AutoML pipeline covering NAS, hyperparameter optimization, auto-augmentation, and model compression (Huawei). **Unmaintained — no commits for 12+ months.** |
| [NASLib](https://github.com/automl/NASLib) | ![](https://img.shields.io/github/stars/automl/NASLib?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/automl/NASLib?style=flat-square&label=&color=green) | NAS research library from AutoML Freiburg with interfaces to state-of-the-art search spaces and optimizers. **Unmaintained — no commits for 12+ months.** |
| [Archai](https://github.com/microsoft/archai) | ![](https://img.shields.io/github/stars/microsoft/archai?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/microsoft/archai?style=flat-square&label=&color=green) | Modular NAS framework for reproducible architecture search research (Microsoft). |

**[⬆ Back to Contents](#contents)**

## Hyperparameter Optimization

*Automated tuning of model hyperparameters using Bayesian, evolutionary, and other search strategies.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Ray Tune](https://docs.ray.io/en/latest/tune/) | ![](https://img.shields.io/github/stars/ray-project/ray?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ray-project/ray?style=flat-square&label=&color=green) | Distributed hyperparameter tuning at scale with support for any ML framework and many search algorithms. |
| [Optuna](https://github.com/optuna/optuna) | ![](https://img.shields.io/github/stars/optuna/optuna?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/optuna/optuna?style=flat-square&label=&color=green) | Define-by-run API with pruning, distributed execution, and a dashboard - the most widely adopted HPO framework. |
| [Hyperopt](https://github.com/hyperopt/hyperopt) | ![](https://img.shields.io/github/stars/hyperopt/hyperopt?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/hyperopt/hyperopt?style=flat-square&label=&color=green) | Pioneered tree-structured Parzen estimators for HPO. **Deprecated since Nov 2021 - use Optuna instead.** |
| [BoTorch](https://github.com/meta-pytorch/botorch) | ![](https://img.shields.io/github/stars/meta-pytorch/botorch?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/meta-pytorch/botorch?style=flat-square&label=&color=green) | Bayesian optimization library in PyTorch for high-dimensional, noisy, and multi-objective problems (Meta). |
| [Keras Tuner](https://github.com/keras-team/keras-tuner) | ![](https://img.shields.io/github/stars/keras-team/keras-tuner?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/keras-team/keras-tuner?style=flat-square&label=&color=green) | Hyperparameter search for Keras models with built-in Bayesian optimization and Hyperband. |
| [Ax](https://github.com/facebook/Ax) | ![](https://img.shields.io/github/stars/facebook/Ax?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/facebook/Ax?style=flat-square&label=&color=green) | Adaptive experimentation platform for multi-objective optimization with BoTorch integration (Meta). |
| [SMAC3](https://github.com/automl/SMAC3) | ![](https://img.shields.io/github/stars/automl/SMAC3?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/automl/SMAC3?style=flat-square&label=&color=green) | Sequential model-based algorithm configuration combining Bayesian optimization with racing mechanisms (AutoML Freiburg). |
| [Dragonfly](https://github.com/dragonfly/dragonfly) | ![](https://img.shields.io/github/stars/dragonfly/dragonfly?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/dragonfly/dragonfly?style=flat-square&label=&color=green) | Scalable Bayesian optimization library supporting multi-fidelity and multi-objective search. **Low activity since 2020.** |

**[⬆ Back to Contents](#contents)**

## Automated Feature Engineering

*Automated generation, transformation, and selection of features from raw data.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Cleanlab](https://github.com/cleanlab/cleanlab) | ![](https://img.shields.io/github/stars/cleanlab/cleanlab?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/cleanlab/cleanlab?style=flat-square&label=&color=green) | Data-centric AI toolkit for finding and fixing label errors, outliers, and data quality issues automatically. |
| [tsfresh](https://github.com/blue-yonder/tsfresh) | ![](https://img.shields.io/github/stars/blue-yonder/tsfresh?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/blue-yonder/tsfresh?style=flat-square&label=&color=green) | Automatic extraction of hundreds of time-series features with built-in statistical relevance filtering. |
| [Featuretools](https://github.com/alteryx/featuretools) | ![](https://img.shields.io/github/stars/alteryx/featuretools?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/alteryx/featuretools?style=flat-square&label=&color=green) | Deep feature synthesis for automatically creating meaningful features from relational and temporal data (Alteryx). |
| [Feature-engine](https://github.com/feature-engine/feature_engine) | ![](https://img.shields.io/github/stars/feature-engine/feature_engine?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/feature-engine/feature_engine?style=flat-square&label=&color=green) | Scikit-learn-compatible transformers for feature creation, selection, encoding, and imputation. |
| [OpenMLDB](https://github.com/4paradigm/OpenMLDB) | ![](https://img.shields.io/github/stars/4paradigm/OpenMLDB?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/4paradigm/OpenMLDB?style=flat-square&label=&color=green) | Database for consistent feature computation between training and serving with SQL-based feature engineering (SIGMOD 2025). |
| [Boruta](https://github.com/scikit-learn-contrib/boruta_py) | ![](https://img.shields.io/github/stars/scikit-learn-contrib/boruta_py?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/scikit-learn-contrib/boruta_py?style=flat-square&label=&color=green) | All-relevant feature selection wrapper using random forest shadow features to identify important predictors. |
| [AutoFeat](https://github.com/cod3licious/autofeat) | ![](https://img.shields.io/github/stars/cod3licious/autofeat?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/cod3licious/autofeat?style=flat-square&label=&color=green) | Scikit-learn-compatible automated feature engineering and selection that generates non-linear features and selects robust subsets. |
| [CAAFE](https://github.com/noahho/CAAFE) | ![](https://img.shields.io/github/stars/noahho/CAAFE?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/noahho/CAAFE?style=flat-square&label=&color=green) | LLM-powered context-aware feature engineering that generates semantically meaningful features with explanations. **Unmaintained — no commits for 12+ months.** |

**[⬆ Back to Contents](#contents)**

## Automated Data Preprocessing

*Automated data profiling, cleaning, validation, and quality assurance.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [ydata-profiling](https://github.com/Data-Centric-AI-Community/ydata-profiling) | ![](https://img.shields.io/github/stars/Data-Centric-AI-Community/ydata-profiling?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Data-Centric-AI-Community/ydata-profiling?style=flat-square&label=&color=green) | One-line data quality profiling and exploratory analysis for Pandas and Spark DataFrames. |
| [Great Expectations](https://github.com/great-expectations/great_expectations) | ![](https://img.shields.io/github/stars/great-expectations/great_expectations?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/great-expectations/great_expectations?style=flat-square&label=&color=green) | Programmable data validation and documentation framework for maintaining pipeline quality. |
| [Pandera](https://github.com/unionai-oss/pandera) | ![](https://img.shields.io/github/stars/unionai-oss/pandera?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/unionai-oss/pandera?style=flat-square&label=&color=green) | Statistical data testing and validation for dataframes with expressive schema definitions. |
| [SweetViz](https://github.com/fbdesignpro/sweetviz) | ![](https://img.shields.io/github/stars/fbdesignpro/sweetviz?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/fbdesignpro/sweetviz?style=flat-square&label=&color=green) | High-density EDA visualizations and target analysis reports generated in two lines of code. |
| [DataPrep](https://github.com/sfu-db/dataprep) | ![](https://img.shields.io/github/stars/sfu-db/dataprep?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/sfu-db/dataprep?style=flat-square&label=&color=green) | Low-code library for data collection, cleaning, and EDA that is 10x faster than traditional profiling. **Unmaintained — no commits for 12+ months.** |
| [Optimus](https://github.com/hi-primus/optimus) | ![](https://img.shields.io/github/stars/hi-primus/optimus?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/hi-primus/optimus?style=flat-square&label=&color=green) | Agile data preparation supporting Pandas, Dask, cuDF, and PySpark with a unified API. **Unmaintained — no commits for 12+ months.** |
| [Spotlight](https://github.com/Renumics/spotlight) | ![](https://img.shields.io/github/stars/Renumics/spotlight?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Renumics/spotlight?style=flat-square&label=&color=green) | Interactive visualization tool for auditing and understanding unstructured ML datasets covering images, audio, and text. |

**[⬆ Back to Contents](#contents)**

## Automated Data Labeling

*Tools that automate or semi-automate the annotation process using AI-assisted labeling.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Label Studio](https://github.com/HumanSignal/label-studio) | ![](https://img.shields.io/github/stars/HumanSignal/label-studio?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/HumanSignal/label-studio?style=flat-square&label=&color=green) | Multi-type data labeling platform with ML-assisted annotation and LLM integration for text, images, audio, and video. |
| [Snorkel](https://github.com/snorkel-team/snorkel) | ![](https://img.shields.io/github/stars/snorkel-team/snorkel?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/snorkel-team/snorkel?style=flat-square&label=&color=green) | Programmatic labeling via weak supervision - write labeling functions instead of hand-labeling. **Unmaintained — no commits for 12+ months.** |
| [Argilla](https://github.com/argilla-io/argilla) | ![](https://img.shields.io/github/stars/argilla-io/argilla?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/argilla-io/argilla?style=flat-square&label=&color=green) | Collaboration platform for collecting and managing human and AI feedback for NLP and LLM development. |
| [Distilabel](https://github.com/argilla-io/distilabel) | ![](https://img.shields.io/github/stars/argilla-io/distilabel?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/argilla-io/distilabel?style=flat-square&label=&color=green) | Framework for synthetic data generation, AI feedback, and instruction tuning using Self-Instruct and EvolInstruct techniques. |
| [Autodistill](https://github.com/autodistill/autodistill) | ![](https://img.shields.io/github/stars/autodistill/autodistill?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/autodistill/autodistill?style=flat-square&label=&color=green) | Automated image labeling by distilling foundation model knowledge into smaller task-specific models (Roboflow). |
| [Autolabel](https://github.com/refuel-ai/autolabel) | ![](https://img.shields.io/github/stars/refuel-ai/autolabel?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/refuel-ai/autolabel?style=flat-square&label=&color=green) | LLM-powered labeling, cleaning, and enrichment for text classification, NER, and entity matching. **Unmaintained — no commits for 12+ months.** |

**[⬆ Back to Contents](#contents)**

## Synthetic Data Generation

*Automated creation of artificial training data that preserves statistical properties of real datasets.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [SDV](https://github.com/sdv-dev/SDV) | ![](https://img.shields.io/github/stars/sdv-dev/SDV?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/sdv-dev/SDV?style=flat-square&label=&color=green) | Synthetic Data Vault with multiple generative models (GaussianCopula, CTGAN, TVAE) for single-table, multi-table, and sequential data. |
| [SDG](https://github.com/hitsz-ids/synthetic-data-generator) | ![](https://img.shields.io/github/stars/hitsz-ids/synthetic-data-generator?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/hitsz-ids/synthetic-data-generator?style=flat-square&label=&color=green) | Framework for generating high-quality synthetic tabular data preserving statistical distributions and correlations. |
| [DataDreamer](https://github.com/datadreamer-dev/DataDreamer) | ![](https://img.shields.io/github/stars/datadreamer-dev/DataDreamer?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/datadreamer-dev/DataDreamer?style=flat-square&label=&color=green) | Reproducible LLM workflows for prompting, synthetic data generation, and model training in one pipeline. **Unmaintained — no commits for 12+ months.** |
| [Gretel Synthetics](https://github.com/gretelai/gretel-synthetics) | ![](https://img.shields.io/github/stars/gretelai/gretel-synthetics?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/gretelai/gretel-synthetics?style=flat-square&label=&color=green) | Synthetic data generators for structured and unstructured text with differential privacy guarantees. **Archived.** |

**[⬆ Back to Contents](#contents)**

## Automated Model Compression

*Automated quantization, pruning, and distillation for efficient model deployment.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [LLM-AWQ](https://github.com/mit-han-lab/llm-awq) | ![](https://img.shields.io/github/stars/mit-han-lab/llm-awq?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/mit-han-lab/llm-awq?style=flat-square&label=&color=green) | Activation-aware weight quantization achieving lossless 4-bit compression for LLMs (MIT HAN Lab, MLSys 2024 Best Paper). |
| [Torch-Pruning](https://github.com/VainF/Torch-Pruning) | ![](https://img.shields.io/github/stars/VainF/Torch-Pruning?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/VainF/Torch-Pruning?style=flat-square&label=&color=green) | Structural pruning framework for any PyTorch model including LLMs, YOLO, ViT, and diffusion models (CVPR 2023). |
| [LLM Compressor](https://github.com/vllm-project/llm-compressor) | ![](https://img.shields.io/github/stars/vllm-project/llm-compressor?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/vllm-project/llm-compressor?style=flat-square&label=&color=green) | Transformers-compatible compression library optimized for efficient vLLM inference. |
| [Intel Neural Compressor](https://github.com/intel/neural-compressor) | ![](https://img.shields.io/github/stars/intel/neural-compressor?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/intel/neural-compressor?style=flat-square&label=&color=green) | Unified quantization, sparsity, pruning, and distillation across PyTorch, TensorFlow, and ONNX (Intel). |
| [NVIDIA TensorRT Model Optimizer](https://github.com/NVIDIA/Model-Optimizer) | ![](https://img.shields.io/github/stars/NVIDIA/Model-Optimizer?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/NVIDIA/Model-Optimizer?style=flat-square&label=&color=green) | Quantization, pruning, distillation, and speculative decoding optimized for TensorRT and vLLM deployment. |
| [GPTQModel](https://github.com/ModelCloud/GPTQModel) | ![](https://img.shields.io/github/stars/ModelCloud/GPTQModel?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ModelCloud/GPTQModel?style=flat-square&label=&color=green) | LLM quantization toolkit with support for NVIDIA CUDA, AMD ROCm, Intel, and Apple Silicon backends. |

**[⬆ Back to Contents](#contents)**

## Automated Deployment and Serving

*Automated model serving, optimization, and inference infrastructure.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Ollama](https://github.com/ollama/ollama) | ![](https://img.shields.io/github/stars/ollama/ollama?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ollama/ollama?style=flat-square&label=&color=green) | Docker-like local LLM runner for getting models up and running quickly for prototyping. |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | ![](https://img.shields.io/github/stars/ggml-org/llama.cpp?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ggml-org/llama.cpp?style=flat-square&label=&color=green) | LLM inference in C/C++ with broad hardware support - the foundation for most local LLM applications. |
| [vLLM](https://github.com/vllm-project/vllm) | ![](https://img.shields.io/github/stars/vllm-project/vllm?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/vllm-project/vllm?style=flat-square&label=&color=green) | High-throughput LLM serving engine with PagedAttention, powering most open-source LLM deployments in production. |
| [SGLang](https://github.com/sgl-project/sglang) | ![](https://img.shields.io/github/stars/sgl-project/sglang?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/sgl-project/sglang?style=flat-square&label=&color=green) | High-performance LLM serving framework powering 400K+ GPUs with best-in-class structured and constrained decoding. |
| [ONNX Runtime](https://github.com/microsoft/onnxruntime) | ![](https://img.shields.io/github/stars/microsoft/onnxruntime?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/microsoft/onnxruntime?style=flat-square&label=&color=green) | Cross-platform inference accelerator supporting PyTorch, TensorFlow, scikit-learn, and XGBoost via the ONNX format (Microsoft). |
| [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) | ![](https://img.shields.io/github/stars/NVIDIA/TensorRT-LLM?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/NVIDIA/TensorRT-LLM?style=flat-square&label=&color=green) | High-performance LLM inference library with custom attention kernels, speculative decoding, and MoE support (NVIDIA). |
| [Triton Inference Server](https://github.com/triton-inference-server/server) | ![](https://img.shields.io/github/stars/triton-inference-server/server?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/triton-inference-server/server?style=flat-square&label=&color=green) | Multi-framework inference serving for TensorRT, PyTorch, ONNX, and custom backends (NVIDIA). |
| [OpenVINO](https://github.com/openvinotoolkit/openvino) | ![](https://img.shields.io/github/stars/openvinotoolkit/openvino?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/openvinotoolkit/openvino?style=flat-square&label=&color=green) | Inference optimization and deployment toolkit for CPUs, GPUs, and edge accelerators (Intel). |
| [BentoML](https://github.com/bentoml/BentoML) | ![](https://img.shields.io/github/stars/bentoml/BentoML?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/bentoml/BentoML?style=flat-square&label=&color=green) | Build production-ready inference APIs, batch jobs, and multi-model pipelines with unified Python framework. |
| [LMDeploy](https://github.com/InternLM/lmdeploy) | ![](https://img.shields.io/github/stars/InternLM/lmdeploy?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/InternLM/lmdeploy?style=flat-square&label=&color=green) | Toolkit for compressing, deploying, and serving large language and vision-language models. |
| [KServe](https://github.com/kserve/kserve) | ![](https://img.shields.io/github/stars/kserve/kserve?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/kserve/kserve?style=flat-square&label=&color=green) | Kubernetes-native standardized model serving with canary rollouts, autoscaling, and multi-framework support (CNCF Incubating). |
| [ExecuTorch](https://github.com/pytorch/executorch) | ![](https://img.shields.io/github/stars/pytorch/executorch?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/pytorch/executorch?style=flat-square&label=&color=green) | On-device AI inference for mobile, embedded, and edge platforms with a 50KB base runtime footprint (Meta). |
| [LitServe](https://github.com/Lightning-AI/LitServe) | ![](https://img.shields.io/github/stars/Lightning-AI/LitServe?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Lightning-AI/LitServe?style=flat-square&label=&color=green) | Minimal, high-performance Python framework for AI model serving (Lightning AI). |

**[⬆ Back to Contents](#contents)**

## Automated Monitoring and Observability

*Automated drift detection, performance monitoring, and quality assurance for deployed models.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Evidently](https://github.com/evidentlyai/evidently) | ![](https://img.shields.io/github/stars/evidentlyai/evidently?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/evidentlyai/evidently?style=flat-square&label=&color=green) | ML and LLM observability with 100+ metrics for evaluating, testing, and monitoring any AI system in production. |
| [Giskard](https://github.com/Giskard-AI/giskard-oss) | ![](https://img.shields.io/github/stars/Giskard-AI/giskard-oss?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Giskard-AI/giskard-oss?style=flat-square&label=&color=green) | Testing and evaluation for ML and LLM models covering bias, performance regression, and security vulnerabilities. |
| [Deepchecks](https://github.com/deepchecks/deepchecks) | ![](https://img.shields.io/github/stars/deepchecks/deepchecks?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/deepchecks/deepchecks?style=flat-square&label=&color=green) | Holistic ML validation covering data integrity, drift detection, and model evaluation in a single suite. |
| [WhyLogs](https://github.com/whylabs/whylogs) | ![](https://img.shields.io/github/stars/whylabs/whylogs?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/whylabs/whylogs?style=flat-square&label=&color=green) | Lightweight data logging library that profiles datasets for drift detection without storing raw data. **Unmaintained — no commits for 12+ months.** |
| [Alibi Detect](https://github.com/SeldonIO/alibi-detect) | ![](https://img.shields.io/github/stars/SeldonIO/alibi-detect?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/SeldonIO/alibi-detect?style=flat-square&label=&color=green) | Outlier, adversarial, and drift detection algorithms for tabular, text, image, and time-series data (Seldon). |
| [NannyML](https://github.com/NannyML/nannyml) | ![](https://img.shields.io/github/stars/NannyML/nannyml?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/NannyML/nannyml?style=flat-square&label=&color=green) | Estimate model performance without ground truth labels and link data drift directly to accuracy degradation. |

**[⬆ Back to Contents](#contents)**

## Automated AI Safety

*Automated testing, red-teaming, and guardrails for ensuring AI system safety and reliability.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Garak](https://github.com/NVIDIA/garak) | ![](https://img.shields.io/github/stars/NVIDIA/garak?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/NVIDIA/garak?style=flat-square&label=&color=green) | LLM vulnerability scanner with 100+ attack modules covering prompt injection, data leakage, and jailbreaking. |
| [Guardrails AI](https://github.com/guardrails-ai/guardrails) | ![](https://img.shields.io/github/stars/guardrails-ai/guardrails?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/guardrails-ai/guardrails?style=flat-square&label=&color=green) | Framework for adding structural and semantic validation guardrails to LLM outputs. |
| [Plano](https://github.com/katanemo/plano) | ![](https://img.shields.io/github/stars/katanemo/plano?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/katanemo/plano?style=flat-square&label=&color=green) | AI-native proxy with built-in orchestration, safety controls, and observability for agentic applications. |
| [NeMo Guardrails](https://github.com/NVIDIA-NeMo/Guardrails) | ![](https://img.shields.io/github/stars/NVIDIA-NeMo/Guardrails?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/NVIDIA-NeMo/Guardrails?style=flat-square&label=&color=green) | Programmable safety rails for LLM-based conversational systems with topical and safety controls (NVIDIA). |
| [DeepTeam](https://github.com/confident-ai/deepteam) | ![](https://img.shields.io/github/stars/confident-ai/deepteam?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/confident-ai/deepteam?style=flat-square&label=&color=green) | Red-teaming framework for systematically testing LLM vulnerabilities across multiple attack vectors. |

**[⬆ Back to Contents](#contents)**

## AutoML Benchmarks

*Standardized frameworks and datasets for evaluating and comparing AutoML systems.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [MLE-Bench](https://github.com/openai/mle-bench) | ![](https://img.shields.io/github/stars/openai/mle-bench?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/openai/mle-bench?style=flat-square&label=&color=green) | Benchmark using 75 Kaggle competitions to evaluate ML engineering agents (OpenAI). |
| [NAS-Bench-101](https://github.com/google-research/nasbench) | ![](https://img.shields.io/github/stars/google-research/nasbench?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/google-research/nasbench?style=flat-square&label=&color=green) | Benchmark dataset with 423,624 evaluated neural architectures for efficient NAS research (Google). **Archived.** |
| [NAS-Bench-201](https://github.com/D-X-Y/NAS-Bench-201) | ![](https://img.shields.io/github/stars/D-X-Y/NAS-Bench-201?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/D-X-Y/NAS-Bench-201?style=flat-square&label=&color=green) | Reproducible benchmark with 15,625 evaluated architectures across three datasets for fair NAS comparison. |
| [AMLB](https://github.com/openml/automlbenchmark) | ![](https://img.shields.io/github/stars/openml/automlbenchmark?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/openml/automlbenchmark?style=flat-square&label=&color=green) | Standard AutoML benchmark comparing frameworks across 104 classification and regression tasks (OpenML). |
| [TabArena](https://github.com/autogluon/tabarena) | ![](https://img.shields.io/github/stars/autogluon/tabarena?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/autogluon/tabarena?style=flat-square&label=&color=green) | Living benchmark for tabular ML with continuously maintained leaderboard and best-practice evaluation (NeurIPS 2025 Spotlight). |

**[⬆ Back to Contents](#contents)**

## MLOps and Experiment Tracking

*Platforms for managing the ML lifecycle, tracking experiments, and orchestrating pipelines.*

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [Ray](https://github.com/ray-project/ray) | ![](https://img.shields.io/github/stars/ray-project/ray?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ray-project/ray?style=flat-square&label=&color=green) | Unified AI compute engine for distributed training, tuning, and model serving with Ray Train, Ray Tune, and Ray Serve. |
| [MLflow](https://github.com/mlflow/mlflow) | ![](https://img.shields.io/github/stars/mlflow/mlflow?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/mlflow/mlflow?style=flat-square&label=&color=green) | End-to-end ML lifecycle platform with experiment tracking, model registry, and integrated prompt optimization. |
| [Langfuse](https://github.com/langfuse/langfuse) | ![](https://img.shields.io/github/stars/langfuse/langfuse?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/langfuse/langfuse?style=flat-square&label=&color=green) | Open-source LLM engineering platform with tracing, evaluations, prompt management, and cost analytics. |
| [Prefect](https://github.com/PrefectHQ/prefect) | ![](https://img.shields.io/github/stars/PrefectHQ/prefect?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/PrefectHQ/prefect?style=flat-square&label=&color=green) | Modern data workflow automation with retries, caching, and real-time logging. |
| [Opik](https://github.com/comet-ml/opik) | ![](https://img.shields.io/github/stars/comet-ml/opik?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/comet-ml/opik?style=flat-square&label=&color=green) | LLM debugging, evaluation, and monitoring platform with detailed tracing and quality dashboards (Comet). |
| [Kubeflow](https://github.com/kubeflow/kubeflow) | ![](https://img.shields.io/github/stars/kubeflow/kubeflow?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/kubeflow/kubeflow?style=flat-square&label=&color=green) | ML toolkit on Kubernetes for building portable, scalable ML pipelines and training workflows. |
| [DVC](https://github.com/treeverse/dvc) | ![](https://img.shields.io/github/stars/treeverse/dvc?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/treeverse/dvc?style=flat-square&label=&color=green) | Version control for data and models with built-in experiment tracking and pipeline management. |
| [Dagster](https://github.com/dagster-io/dagster) | ![](https://img.shields.io/github/stars/dagster-io/dagster?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/dagster-io/dagster?style=flat-square&label=&color=green) | Asset-centric orchestration built for ML pipelines with data lineage tracking and observability. |
| [W&B](https://github.com/wandb/wandb) | ![](https://img.shields.io/github/stars/wandb/wandb?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/wandb/wandb?style=flat-square&label=&color=green) | Experiment tracking, visualization, and collaboration platform for ML teams (Weights and Biases). |
| [Kedro](https://github.com/kedro-org/kedro) | ![](https://img.shields.io/github/stars/kedro-org/kedro?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/kedro-org/kedro?style=flat-square&label=&color=green) | Framework for reproducible, maintainable ML pipelines with clean coding patterns. |
| [Metaflow](https://github.com/Netflix/metaflow) | ![](https://img.shields.io/github/stars/Netflix/metaflow?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Netflix/metaflow?style=flat-square&label=&color=green) | Human-centric framework for managing real-life data science and ML projects at scale (Netflix). |
| [Phoenix](https://github.com/Arize-ai/phoenix) | ![](https://img.shields.io/github/stars/Arize-ai/phoenix?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Arize-ai/phoenix?style=flat-square&label=&color=green) | AI observability platform with OpenTelemetry-native tracing and LLM evaluation dashboards (Arize). |
| [Feast](https://github.com/feast-dev/feast) | ![](https://img.shields.io/github/stars/feast-dev/feast?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/feast-dev/feast?style=flat-square&label=&color=green) | Open-source feature store for managing and serving ML features in real-time and batch inference. |
| [ClearML](https://github.com/clearml/clearml) | ![](https://img.shields.io/github/stars/clearml/clearml?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/clearml/clearml?style=flat-square&label=&color=green) | Unified experiment manager, pipeline orchestrator, and data/model management platform. |
| [Aim](https://github.com/aimhubio/aim) | ![](https://img.shields.io/github/stars/aimhubio/aim?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/aimhubio/aim?style=flat-square&label=&color=green) | Self-hosted experiment tracker with a high-performance UI that handles 10,000+ training runs. |
| [ZenML](https://github.com/zenml-io/zenml) | ![](https://img.shields.io/github/stars/zenml-io/zenml?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/zenml-io/zenml?style=flat-square&label=&color=green) | Framework for building portable, production-ready ML pipelines that run on any infrastructure. |

**[⬆ Back to Contents](#contents)**

## Related Awesome Lists

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [awesome-machine-learning](https://github.com/josephmisiti/awesome-machine-learning) | ![](https://img.shields.io/github/stars/josephmisiti/awesome-machine-learning?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/josephmisiti/awesome-machine-learning?style=flat-square&label=&color=green) | Curated list of ML frameworks, libraries, and software organized by language. |
| [awesome-deep-learning](https://github.com/ChristosChristofidis/awesome-deep-learning) | ![](https://img.shields.io/github/stars/ChristosChristofidis/awesome-deep-learning?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ChristosChristofidis/awesome-deep-learning?style=flat-square&label=&color=green) | Curated list of deep learning tutorials, projects, and communities. |
| [awesome-llm](https://github.com/Hannibal046/Awesome-LLM) | ![](https://img.shields.io/github/stars/Hannibal046/Awesome-LLM?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Hannibal046/Awesome-LLM?style=flat-square&label=&color=green) | Curated list of large language model resources covering papers, tools, and applications. |
| [awesome-production-machine-learning](https://github.com/EthicalML/awesome-production-machine-learning) | ![](https://img.shields.io/github/stars/EthicalML/awesome-production-machine-learning?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/EthicalML/awesome-production-machine-learning?style=flat-square&label=&color=green) | Curated list of tools for deploying, monitoring, and scaling ML in production. |
| [awesome-mlops](https://github.com/visenger/awesome-mlops) | ![](https://img.shields.io/github/stars/visenger/awesome-mlops?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/visenger/awesome-mlops?style=flat-square&label=&color=green) | Curated list of MLOps tools and best practices for production ML. **Unmaintained — no commits for 12+ months.** |
| [awesome-generative-ai](https://github.com/steven2358/awesome-generative-ai) | ![](https://img.shields.io/github/stars/steven2358/awesome-generative-ai?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/steven2358/awesome-generative-ai?style=flat-square&label=&color=green) | Curated list of modern generative AI projects and services. |

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

## Related Awesome Lists

| Project | ⭐ | Updated | Description |
|:--------|:---|:--------|:------------|
| [awesome-machine-learning](https://github.com/josephmisiti/awesome-machine-learning) | ![](https://img.shields.io/github/stars/josephmisiti/awesome-machine-learning?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/josephmisiti/awesome-machine-learning?style=flat-square&label=&color=green) | Curated list of ML frameworks, libraries, and software organized by language. |
| [awesome-deep-learning](https://github.com/ChristosChristofidis/awesome-deep-learning) | ![](https://img.shields.io/github/stars/ChristosChristofidis/awesome-deep-learning?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/ChristosChristofidis/awesome-deep-learning?style=flat-square&label=&color=green) | Curated list of deep learning tutorials, projects, and communities. |
| [awesome-llm](https://github.com/Hannibal046/Awesome-LLM) | ![](https://img.shields.io/github/stars/Hannibal046/Awesome-LLM?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/Hannibal046/Awesome-LLM?style=flat-square&label=&color=green) | Curated list of large language model resources covering papers, tools, and applications. |
| [awesome-production-machine-learning](https://github.com/EthicalML/awesome-production-machine-learning) | ![](https://img.shields.io/github/stars/EthicalML/awesome-production-machine-learning?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/EthicalML/awesome-production-machine-learning?style=flat-square&label=&color=green) | Curated list of tools for deploying, monitoring, and scaling ML in production. |
| [awesome-mlops](https://github.com/visenger/awesome-mlops) | ![](https://img.shields.io/github/stars/visenger/awesome-mlops?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/visenger/awesome-mlops?style=flat-square&label=&color=green) | Curated list of MLOps tools and best practices for production ML. |
| [awesome-generative-ai](https://github.com/steven2358/awesome-generative-ai) | ![](https://img.shields.io/github/stars/steven2358/awesome-generative-ai?style=flat-square&label=&color=blue) | ![](https://img.shields.io/github/last-commit/steven2358/awesome-generative-ai?style=flat-square&label=&color=green) | Curated list of modern generative AI projects and services. |

**[⬆ Back to Contents](#contents)**

## Contributing

Contributions welcome! Read the [contributing guidelines](contributing.md) first.
