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

### **[> Explore interactively <](https://jbogocz.github.io/awesome-automl)**

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
| [Ludwig](https://github.com/ludwig-ai/ludwig) | 11,665 | 2026-04 | Declarative deep learning | Tabular, text, image |
| [AutoGluon](https://github.com/autogluon/autogluon) | 10,206 | 2026-04 | Overall accuracy | Tabular, text, image, TS |
| [TPOT](https://github.com/EpistasisLab/tpot) | 10,047 | 2025-09 | Pipeline discovery | Tabular (sklearn) |
| [PyCaret](https://github.com/pycaret/pycaret) | 9,738 | 2025-04 | Quick prototyping | Tabular |
| [AutoKeras](https://github.com/keras-team/autokeras) | 9,316 | 2025-11 | Deep learning | Image, text, tabular |
| [H2O AutoML](https://github.com/h2oai/h2o-3) | 7,522 | 2026-04 | Enterprise / distributed | Tabular |
| [FLAML](https://github.com/microsoft/FLAML) | 4,319 | 2026-04 | Resource-constrained | Tabular |
| [MLJAR](https://github.com/mljar/mljar-supervised) | 3,251 | 2026-03 | Explainability | Tabular |

## General-Purpose AutoML

*End-to-end frameworks that automate model selection, hyperparameter tuning, and pipeline construction.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Ludwig](https://github.com/ludwig-ai/ludwig) | 11,665 | 2026-04 | Declarative deep learning framework supporting custom model building and LLM fine-tuning via YAML configs. Now under Linux Foundation AI & Data. |
| [AutoGluon](https://github.com/autogluon/autogluon) | 10,206 | 2026-04 | Multi-layer stack ensembling for tabular, text, image, time-series, and multimodal data - won medals in 15/18 Kaggle tabular contests in 2024 (Amazon). |
| [TPOT](https://github.com/EpistasisLab/tpot) | 10,047 | 2025-09 | Genetic programming-based pipeline optimizer that designs and optimizes scikit-learn pipelines. |
| [PyCaret](https://github.com/pycaret/pycaret) | 9,738 | 2025-04 | Low-code machine learning library that automates model training, tuning, and deployment workflows in Python. |
| [AutoKeras](https://github.com/keras-team/autokeras) | 9,316 | 2025-11 | Neural architecture search for deep learning models built on top of Keras. |
| [auto-sklearn](https://github.com/automl/auto-sklearn) | 8,079 | 2026-01 | Historically important AutoML toolkit using Bayesian optimization, meta-learning, and ensemble construction. **Unmaintained since Sep 2022; broken on Python 3.10+.** |
| [H2O AutoML](https://github.com/h2oai/h2o-3) | 7,522 | 2026-04 | Distributed machine learning platform with automatic training and tuning of many models within a user-specified time limit. |
| [FLAML](https://github.com/microsoft/FLAML) | 4,319 | 2026-04 | Fast and lightweight AutoML that finds good models with minimal resources - often the best choice for resource-constrained environments (Microsoft). |
| [LazyPredict](https://github.com/shankarpandala/lazypredict) | 3,308 | 2026-03 | Build and evaluate dozens of scikit-learn models in a single line of code for rapid baseline comparison. **Low activity since 2022.** |
| [MLJAR Supervised](https://github.com/mljar/mljar-supervised) | 3,251 | 2026-03 | Automated ML with automatic explanations, visualizations, and Markdown reports for every trained model. |
| [LightAutoML](https://github.com/sb-ai-lab/LightAutoML) | 1,458 | 2026-01 | Fast and customizable AutoML framework with Kaggle-winning performance (Sber AI Lab). |
| [EvalML](https://github.com/alteryx/evalml) | 846 | 2026-01 | AutoML library for building, optimizing, and evaluating ML pipelines with domain-specific objectives (Alteryx). |
| [SapientML](https://github.com/sapientml/sapientml) | 449 | 2026-03 | Generative AutoML that synthesizes pipelines by learning from a corpus of existing ML solutions. |
| [Auto-WEKA](https://github.com/automl/autoweka) | 336 | 2022-03 | The original AutoML system (2013) combining algorithm selection and HPO in WEKA. **Historical; Java-only, maintenance mode.** |
| [GAMA](https://github.com/amore-labs/gama) | 103 | 2024-09 | AutoML tool that generates optimized ML pipelines using genetic programming and Bayesian optimization (OpenML). **Unmaintained — no commits for 12+ months.** |

**[⬆ Back to Contents](#contents)**

## Foundation Models as AutoML

*Pretrained models that replace traditional pipeline-search AutoML with a single forward pass or zero-shot inference.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [TimesFM](https://github.com/google-research/timesfm) | 15,401 | 2026-04 | Time-series foundation model for zero-shot forecasting across domains without task-specific training (Google). |
| [TabPFN](https://github.com/PriorLabs/TabPFN) | 6,011 | 2026-04 | Tabular foundation model that matches tuned XGBoost in 2.8 seconds with a single forward pass - 100% win rate vs default XGBoost on datasets under 10K rows (Nature 2024, now v2.6 supporting up to 100K rows). |
| [Chronos](https://github.com/amazon-science/chronos-forecasting) | 5,087 | 2026-03 | Pretrained time-series foundation model for zero-shot probabilistic forecasting on unseen data (Amazon). |
| [Moirai](https://github.com/SalesforceAIResearch/uni2ts) | 1,462 | 2026-01 | Universal time-series forecasting transformer supporting multivariate forecasting unlike most competitors. Moirai-MoE released Oct 2024 (Salesforce). |
| [TabM](https://github.com/yandex-research/tabm) | 986 | 2025-11 | Parameter-efficient ensemble of MLPs based on BatchEnsemble, achieving top performance among tabular deep learning models without attention complexity (ICLR 2025, Yandex). |
| [TALENT](https://github.com/LAMDA-Tabular/TALENT) | 834 | 2026-03 | Comprehensive toolkit and benchmark for tabular learning covering 35+ deep methods across 300 datasets. |
| [TabICL](https://github.com/soda-inria/tabicl) | 716 | 2026-03 | State-of-the-art tabular foundation model achieving 10x faster inference than TabPFN v2.5 (ICML 2025). |
| [CARTE](https://github.com/soda-inria/carte) | 168 | 2025-08 | Context-aware tabular representation using pretrained language models for data with heterogeneous columns. |

**[⬆ Back to Contents](#contents)**

## Automated Fine-Tuning

*Tools that automate the process of adapting large language models to specific tasks and domains.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [LLaMA-Factory](https://github.com/hiyouga/LlamaFactory) | 69,691 | 2026-04 | Unified fine-tuning framework for 100+ LLMs and VLMs with Full, LoRA, QLoRA, and DoRA methods plus web UI (ACL 2024). |
| [Unsloth](https://github.com/unslothai/unsloth) | 59,957 | 2026-04 | Fine-tune LLMs 2-5x faster with 80% less memory on a single GPU through optimized kernels and custom autograd. |
| [PEFT](https://github.com/huggingface/peft) | 20,899 | 2026-04 | Standard library for parameter-efficient fine-tuning - LoRA, QLoRA, Spectrum, and more. Deeply integrated with the Hugging Face ecosystem. |
| [TRL](https://github.com/huggingface/trl) | 17,961 | 2026-04 | Transformer Reinforcement Learning with SFT, DPO, RLHF, and GRPO trainers for alignment and preference tuning (Hugging Face). |
| [LitGPT](https://github.com/Lightning-AI/litgpt) | 13,283 | 2026-04 | Recipes for pretraining, fine-tuning, and deploying 20+ LLM architectures on your own data (Lightning AI). |
| [Axolotl](https://github.com/axolotl-ai-cloud/axolotl) | 11,603 | 2026-04 | Production-grade fine-tuning with multi-GPU support, sequence parallelism, and multimodal capabilities. |
| [LMFlow](https://github.com/OptimalScale/LMFlow) | 8,488 | 2026-03 | Extensible toolkit for fine-tuning and inference of large foundation models, NAACL 2024 Best Demo Award. |
| [torchtune](https://github.com/meta-pytorch/torchtune) | 5,724 | 2026-04 | Native PyTorch library for fine-tuning LLMs with composable building blocks and YAML configs (Meta). |
| [Hugging Face AutoTrain](https://github.com/huggingface/autotrain-advanced) | 4,568 | 2026-04 | No-code training for LLMs, vision-language models, text classification, and tabular data (Hugging Face). |
| [LoRAX](https://github.com/predibase/lorax) | 3,744 | 2025-05 | Multi-LoRA inference server that scales to thousands of fine-tuned LLMs on a single GPU (Predibase). |

**[⬆ Back to Contents](#contents)**

## Automated Prompt Optimization

*Systematic optimization of prompts, instructions, and demonstrations to improve LLM performance without manual tuning.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [DSPy](https://github.com/stanfordnlp/dspy) | 33,511 | 2026-04 | Declarative framework replacing hand-written prompts with automatic optimizers - GPT-3.5 with DSPy outperforms expert prompts by up to 46% (Stanford NLP). |
| [PromptWizard](https://github.com/microsoft/PromptWizard) | 3,830 | 2025-10 | Task-aware agent-driven prompt optimization using self-evolving critique and synthesis (Microsoft). |
| [TextGrad](https://github.com/zou-group/textgrad) | 3,474 | 2025-07 | Automatic differentiation via text feedback, enabling gradient-like optimization of compound AI systems (Nature 2024). |
| [GEPA](https://github.com/gepa-ai/gepa) | 3,211 | 2026-04 | Reflective text evolution for prompt, code, and text optimization, integrated into MLflow (Cerebras). |
| [AutoPrompt](https://github.com/Eladlev/AutoPrompt) | 2,960 | 2025-12 | Intent-based prompt calibration using synthetic data generation for iterative prompt refinement. |
| [Mirascope](https://github.com/Mirascope/mirascope) | 1,453 | 2026-04 | Pythonic toolkit for building LLM applications with integrated prompt versioning, tracing, and optimization. |
| [Promptomatix](https://github.com/SalesforceAIResearch/promptomatix) | 938 | 2025-08 | DSPy-powered automatic prompt optimization that transforms task descriptions into optimized prompts with cost-aware objectives (Salesforce). |
| [Prompt-Ops](https://github.com/meta-llama/prompt-ops) | 794 | 2026-01 | Open-source command-line tool for building, optimizing, and managing prompts at scale (Meta). |
| [EvoPrompt](https://github.com/beeevita/EvoPrompt) | 224 | 2025-09 | Connects LLMs with evolutionary algorithms for discrete prompt optimization with up to 25% improvement over manual prompts. |

**[⬆ Back to Contents](#contents)**

## Automated AI Research

*Autonomous systems that design experiments, run them, and analyze results without human intervention.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [AutoResearch](https://github.com/karpathy/autoresearch) | 68,055 | 2026-03 | Minimal script enabling AI agents to autonomously run ~100 ML experiments overnight at ~12/hour, finding genuine improvements that transfer to larger models (Karpathy, March 2026). |
| [AutoGen](https://github.com/microsoft/autogen) | 56,795 | 2026-04 | Multi-agent conversation framework for building AI agent systems. Now in maintenance mode as AG2 (Microsoft). |
| [CrewAI](https://github.com/crewAIInc/crewAI) | 48,273 | 2026-04 | Multi-agent framework orchestrating role-playing specialist agents for complex AI workflows. |
| [STORM](https://github.com/stanford-oval/storm) | 28,060 | 2025-09 | LLM-powered knowledge curation that researches topics and generates full articles with citations (Stanford). |
| [AI-Scientist](https://github.com/SakanaAI/AI-Scientist) | 13,098 | 2025-12 | Fully automated open-ended scientific discovery from idea generation to experiment execution to paper writing (Sakana AI). |
| [PaperQA](https://github.com/Future-House/paper-qa) | 8,347 | 2026-03 | High-accuracy retrieval-augmented generation for answering questions from scientific literature. |
| [AI-Scientist-v2](https://github.com/SakanaAI/AI-Scientist-v2) | 5,206 | 2025-12 | Second generation using agentic tree search, producing the first AI-generated paper accepted at a peer-reviewed workshop. |
| [AI-Researcher](https://github.com/HKUDS/AI-Researcher) | 5,067 | 2025-10 | Autonomous agent automating the full research lifecycle from literature review to experimentation (NeurIPS 2025 Spotlight). |
| [AIDE](https://github.com/WecoAI/aideml) | 1,211 | 2026-02 | ML engineering agent using tree search over solution space - exceeds 50% of human Kaggle competitors; top agents using AIDE achieve medals in 64%+ of MLE-Bench competitions (Weco AI). |
| [AutoML-Agent](https://github.com/DeepAuto-AI/automl-agent) | 118 | 2025-07 | Multi-agent LLM framework for full-pipeline AutoML from data retrieval through model deployment (ICML 2025). |

**[⬆ Back to Contents](#contents)**

## ML Engineering Agents

*AI agents that autonomously write, debug, and optimize code for software and ML engineering.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [OpenHands](https://github.com/OpenHands/OpenHands) | 70,767 | 2026-04 | AI software development platform achieving 53-72% resolve rate on SWE-Bench Verified. |
| [Aider](https://github.com/Aider-AI/aider) | 42,963 | 2026-03 | AI pair programmer in the terminal that edits code directly in your local repository. |
| [SWE-agent](https://github.com/SWE-agent/SWE-agent) | 18,944 | 2026-04 | Autonomous agent that solves real GitHub issues by reading, editing, and testing code (NeurIPS 2024). |
| [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) | 3,703 | 2026-04 | Minimalist 100-line coding agent achieving 74% on SWE-bench Verified as a learning reference. |
| [AutoCodeRover](https://github.com/AutoCodeRoverSG/auto-code-rover) | 3,064 | 2025-04 | Structure-aware autonomous program repair combining code search with LLM-based patching. |

**[⬆ Back to Contents](#contents)**

## LLM Evaluation and Testing

*Frameworks for automated evaluation, testing, and benchmarking of language models and AI systems.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Promptfoo](https://github.com/promptfoo/promptfoo) | 19,708 | 2026-04 | Test and red-team LLM applications with automated evaluations, CI/CD integration, and vulnerability scanning. |
| [DeepEval](https://github.com/confident-ai/deepeval) | 14,573 | 2026-04 | Pytest-like framework with 14+ evaluation metrics for RAG, fine-tuning, and alignment assessment. |
| [RAGAS](https://github.com/vibrantlabsai/ragas) | 13,265 | 2026-02 | Evaluation framework for RAG quality assessment measuring both retrieval and generation with LLM-based and traditional metrics. |
| [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) | 12,040 | 2026-04 | Standard framework for few-shot evaluation of language models across hundreds of benchmarks (EleutherAI). |
| [OpenCompass](https://github.com/open-compass/opencompass) | 6,835 | 2026-04 | One-stop evaluation platform supporting 100+ models across academic and real-world benchmarks. |
| [Agenta](https://github.com/Agenta-AI/agenta) | 4,011 | 2026-04 | Open-source LLMOps platform combining prompt playground, evaluation workflows, and production observability. |
| [TruLens](https://github.com/truera/trulens) | 3,232 | 2026-04 | OpenTelemetry-based tracing and evaluation for RAG and agent workflows with built-in feedback functions (Snowflake/TruEra). |
| [LangWatch](https://github.com/langwatch/langwatch) | 3,187 | 2026-04 | Evaluation and testing platform for LLM applications and AI agents with automated quality guardrails. |
| [LightEval](https://github.com/huggingface/lighteval) | 2,369 | 2026-04 | All-in-one LLM evaluation toolkit powering the Open LLM Leaderboard, supporting 1000+ tasks across multiple backends (Hugging Face). |
| [Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai) | 1,887 | 2026-04 | Framework for reproducible LLM evals with sandboxed agent execution, 100+ prebuilt evaluations, and VS Code integration (UK AI Safety Institute). |

**[⬆ Back to Contents](#contents)**

## LLM Routing and Selection

*Intelligent routing of requests to the optimal model based on task complexity, cost, and performance.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [LiteLLM](https://github.com/BerriAI/litellm) | 42,468 | 2026-04 | Unified API gateway for 100+ LLMs with load balancing, cost tracking, and automatic fallback routing. |
| [Portkey Gateway](https://github.com/Portkey-AI/gateway) | 11,233 | 2026-03 | AI gateway for intelligent routing, caching, load balancing, and fallbacks across 200+ LLMs. |
| [RouteLLM](https://github.com/lm-sys/RouteLLM) | 4,768 | 2024-08 | Framework for training and serving LLM routers that reduce costs by up to 85% without quality loss (LMSYS). **Unmaintained — no commits for 12+ months.** |
| [LLMRouter](https://github.com/ulab-uiuc/LLMRouter) | 1,607 | 2026-03 | Unified library with 16+ router implementations and standardized evaluation via command-line interface. |

**[⬆ Back to Contents](#contents)**

## Time-Series AutoML

*Automated forecasting, classification, and anomaly detection for temporal data.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [sktime](https://github.com/sktime/sktime) | 9,712 | 2026-04 | Unified framework for time-series forecasting, classification, regression, and clustering with scikit-learn-compatible interfaces. |
| [Darts](https://github.com/unit8co/darts) | 9,310 | 2026-04 | Unified API for 30+ forecasting models from ARIMA to transformers, with backtesting and ensembling built in. |
| [Nixtla StatsForecast](https://github.com/Nixtla/statsforecast) | 4,746 | 2026-04 | Lightning-fast statistical models including AutoARIMA, AutoETS, and AutoCES for millions of time series. |
| [Merlion](https://github.com/salesforce/Merlion) | 4,470 | 2026-03 | Time-series intelligence library with unified interfaces for forecasting, anomaly detection, and change-point detection (Salesforce). **Archived.** |
| [Nixtla NeuralForecast](https://github.com/Nixtla/neuralforecast) | 4,034 | 2026-04 | Production-ready neural forecasting with 30+ state-of-the-art models including N-BEATS, TFT, and PatchTST. |
| [PyPOTS](https://github.com/WenjieDu/PyPOTS) | 1,984 | 2026-04 | Toolbox with 50+ deep learning models for partially-observed time-series imputation, classification, and clustering. |
| [Lag-Llama](https://github.com/time-series-foundation-models/lag-llama) | 1,567 | 2025-06 | First open-source foundation model for univariate probabilistic time-series forecasting based on a decoder-only transformer (NeurIPS 2024). |
| [skforecast](https://github.com/skforecast/skforecast) | 1,476 | 2026-04 | Scikit-learn-compatible multi-step forecasting with XGBoost, LightGBM, CatBoost, and feature engineering utilities. |
| [AutoTS](https://github.com/winedarksea/AutoTS) | 1,384 | 2026-04 | Genetic algorithm-based automated model selection, ensembling, and anomaly detection for time-series data. |
| [aeon](https://github.com/aeon-toolkit/aeon) | 1,366 | 2026-04 | Next-generation time-series ML toolkit for classification, regression, clustering, and anomaly detection. |
| [Nixtla MLForecast](https://github.com/Nixtla/mlforecast) | 1,204 | 2026-04 | Scalable ML-based forecasting with LightGBM, XGBoost, and distributed backends via Dask, Spark, and Ray. |
| [Time-MoE](https://github.com/Time-MoE/Time-MoE) | 941 | 2026-03 | First billion-scale time-series foundation model using sparse mixture-of-experts, trained on 300B+ time points (ICLR 2025 Spotlight). |
| [Granite-TSFM](https://github.com/ibm-granite/granite-tsfm) | 834 | 2026-04 | Compact pretrained Tiny Time Mixers that rival billion-parameter models for zero/few-shot multivariate forecasting (IBM, NeurIPS 2024). |

**[⬆ Back to Contents](#contents)**

## Neural Architecture Search

*Automated design and discovery of optimal neural network architectures.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [NNI](https://github.com/microsoft/nni) | 14,346 | 2024-07 | Comprehensive AutoML toolkit for NAS, hyperparameter tuning, feature engineering, and model compression. **Archived by Microsoft in Sep 2024.** |
| [Google AutoML](https://github.com/google/automl) | 6,463 | 2025-03 | Research code for EfficientNet, EfficientDet, MnasNet, and other NAS-discovered architectures (Google Brain). **Unmaintained — no commits for 12+ months.** |
| [Once-For-All](https://github.com/mit-han-lab/once-for-all) | 1,947 | 2023-12 | Train one network and specialize sub-networks for diverse hardware without retraining (MIT HAN Lab, ICLR 2020). **Unmaintained — no commits for 12+ months.** |
| [TinyEngine](https://github.com/mit-han-lab/tinyengine) | 934 | 2024-11 | Memory-efficient inference engine for NAS-optimized models on microcontrollers (MIT HAN Lab). **Unmaintained — no commits for 12+ months.** |
| [Vega](https://github.com/huawei-noah/vega) | 851 | 2023-02 | AutoML pipeline covering NAS, hyperparameter optimization, auto-augmentation, and model compression (Huawei). **Unmaintained — no commits for 12+ months.** |
| [NASLib](https://github.com/automl/NASLib) | 586 | 2024-11 | NAS research library from AutoML Freiburg with interfaces to state-of-the-art search spaces and optimizers. **Unmaintained — no commits for 12+ months.** |
| [Archai](https://github.com/microsoft/archai) | 483 | 2025-11 | Modular NAS framework for reproducible architecture search research (Microsoft). |

**[⬆ Back to Contents](#contents)**

## Hyperparameter Optimization

*Automated tuning of model hyperparameters using Bayesian, evolutionary, and other search strategies.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Ray Tune](https://docs.ray.io/en/latest/tune/) | 42,001 | 2026-04 | Distributed hyperparameter tuning at scale with support for any ML framework and many search algorithms. |
| [Optuna](https://github.com/optuna/optuna) | 13,866 | 2026-04 | Define-by-run API with pruning, distributed execution, and a dashboard - the most widely adopted HPO framework. |
| [Hyperopt](https://github.com/hyperopt/hyperopt) | 7,615 | 2026-03 | Pioneered tree-structured Parzen estimators for HPO. **Deprecated since Nov 2021 - use Optuna instead.** |
| [BoTorch](https://github.com/meta-pytorch/botorch) | 3,497 | 2026-04 | Bayesian optimization library in PyTorch for high-dimensional, noisy, and multi-objective problems (Meta). |
| [Keras Tuner](https://github.com/keras-team/keras-tuner) | 2,923 | 2025-12 | Hyperparameter search for Keras models with built-in Bayesian optimization and Hyperband. |
| [Ax](https://github.com/facebook/Ax) | 2,733 | 2026-04 | Adaptive experimentation platform for multi-objective optimization with BoTorch integration (Meta). |
| [SMAC3](https://github.com/automl/SMAC3) | 1,221 | 2026-04 | Sequential model-based algorithm configuration combining Bayesian optimization with racing mechanisms (AutoML Freiburg). |
| [Dragonfly](https://github.com/dragonfly/dragonfly) | 893 | 2023-06 | Scalable Bayesian optimization library supporting multi-fidelity and multi-objective search. **Low activity since 2020.** |

**[⬆ Back to Contents](#contents)**

## Automated Feature Engineering

*Automated generation, transformation, and selection of features from raw data.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Cleanlab](https://github.com/cleanlab/cleanlab) | 11,411 | 2026-01 | Data-centric AI toolkit for finding and fixing label errors, outliers, and data quality issues automatically. |
| [tsfresh](https://github.com/blue-yonder/tsfresh) | 9,168 | 2025-11 | Automatic extraction of hundreds of time-series features with built-in statistical relevance filtering. |
| [Featuretools](https://github.com/alteryx/featuretools) | 7,627 | 2026-02 | Deep feature synthesis for automatically creating meaningful features from relational and temporal data (Alteryx). |
| [Feature-engine](https://github.com/feature-engine/feature_engine) | 2,221 | 2026-03 | Scikit-learn-compatible transformers for feature creation, selection, encoding, and imputation. |
| [OpenMLDB](https://github.com/4paradigm/OpenMLDB) | 1,685 | 2026-04 | Database for consistent feature computation between training and serving with SQL-based feature engineering (SIGMOD 2025). |
| [Boruta](https://github.com/scikit-learn-contrib/boruta_py) | 1,624 | 2025-11 | All-relevant feature selection wrapper using random forest shadow features to identify important predictors. |
| [AutoFeat](https://github.com/cod3licious/autofeat) | 536 | 2026-01 | Scikit-learn-compatible automated feature engineering and selection that generates non-linear features and selects robust subsets. |
| [CAAFE](https://github.com/noahho/CAAFE) | 186 | 2024-12 | LLM-powered context-aware feature engineering that generates semantically meaningful features with explanations. **Unmaintained — no commits for 12+ months.** |

**[⬆ Back to Contents](#contents)**

## Automated Data Preprocessing

*Automated data profiling, cleaning, validation, and quality assurance.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [ydata-profiling](https://github.com/Data-Centric-AI-Community/ydata-profiling) | 13,489 | 2026-03 | One-line data quality profiling and exploratory analysis for Pandas and Spark DataFrames. |
| [Great Expectations](https://github.com/great-expectations/great_expectations) | 11,366 | 2026-04 | Programmable data validation and documentation framework for maintaining pipeline quality. |
| [Pandera](https://github.com/unionai-oss/pandera) | 4,290 | 2026-04 | Statistical data testing and validation for dataframes with expressive schema definitions. |
| [SweetViz](https://github.com/fbdesignpro/sweetviz) | 3,089 | 2026-04 | High-density EDA visualizations and target analysis reports generated in two lines of code. |
| [DataPrep](https://github.com/sfu-db/dataprep) | 2,237 | 2024-06 | Low-code library for data collection, cleaning, and EDA that is 10x faster than traditional profiling. **Unmaintained — no commits for 12+ months.** |
| [Optimus](https://github.com/hi-primus/optimus) | 1,537 | 2024-12 | Agile data preparation supporting Pandas, Dask, cuDF, and PySpark with a unified API. **Unmaintained — no commits for 12+ months.** |
| [Spotlight](https://github.com/Renumics/spotlight) | 1,255 | 2026-03 | Interactive visualization tool for auditing and understanding unstructured ML datasets covering images, audio, and text. |

**[⬆ Back to Contents](#contents)**

## Automated Data Labeling

*Tools that automate or semi-automate the annotation process using AI-assisted labeling.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Label Studio](https://github.com/HumanSignal/label-studio) | 26,946 | 2026-04 | Multi-type data labeling platform with ML-assisted annotation and LLM integration for text, images, audio, and video. |
| [Snorkel](https://github.com/snorkel-team/snorkel) | 5,947 | 2024-05 | Programmatic labeling via weak supervision - write labeling functions instead of hand-labeling. **Unmaintained — no commits for 12+ months.** |
| [Argilla](https://github.com/argilla-io/argilla) | 4,925 | 2026-04 | Collaboration platform for collecting and managing human and AI feedback for NLP and LLM development. |
| [Distilabel](https://github.com/argilla-io/distilabel) | 3,156 | 2026-04 | Framework for synthetic data generation, AI feedback, and instruction tuning using Self-Instruct and EvolInstruct techniques. |
| [Autodistill](https://github.com/autodistill/autodistill) | 2,658 | 2025-05 | Automated image labeling by distilling foundation model knowledge into smaller task-specific models (Roboflow). |
| [Autolabel](https://github.com/refuel-ai/autolabel) | 2,310 | 2025-03 | LLM-powered labeling, cleaning, and enrichment for text classification, NER, and entity matching. **Unmaintained — no commits for 12+ months.** |

**[⬆ Back to Contents](#contents)**

## Synthetic Data Generation

*Automated creation of artificial training data that preserves statistical properties of real datasets.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [SDV](https://github.com/sdv-dev/SDV) | 3,461 | 2026-04 | Synthetic Data Vault with multiple generative models (GaussianCopula, CTGAN, TVAE) for single-table, multi-table, and sequential data. |
| [SDG](https://github.com/hitsz-ids/synthetic-data-generator) | 2,416 | 2026-04 | Framework for generating high-quality synthetic tabular data preserving statistical distributions and correlations. |
| [DataDreamer](https://github.com/datadreamer-dev/DataDreamer) | 1,108 | 2025-02 | Reproducible LLM workflows for prompting, synthetic data generation, and model training in one pipeline. **Unmaintained — no commits for 12+ months.** |
| [Gretel Synthetics](https://github.com/gretelai/gretel-synthetics) | 676 | 2025-06 | Synthetic data generators for structured and unstructured text with differential privacy guarantees. **Archived.** |

**[⬆ Back to Contents](#contents)**

## Automated Model Compression

*Automated quantization, pruning, and distillation for efficient model deployment.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [LLM-AWQ](https://github.com/mit-han-lab/llm-awq) | 3,491 | 2025-07 | Activation-aware weight quantization achieving lossless 4-bit compression for LLMs (MIT HAN Lab, MLSys 2024 Best Paper). |
| [Torch-Pruning](https://github.com/VainF/Torch-Pruning) | 3,282 | 2025-09 | Structural pruning framework for any PyTorch model including LLMs, YOLO, ViT, and diffusion models (CVPR 2023). |
| [LLM Compressor](https://github.com/vllm-project/llm-compressor) | 2,986 | 2026-04 | Transformers-compatible compression library optimized for efficient vLLM inference. |
| [Intel Neural Compressor](https://github.com/intel/neural-compressor) | 2,611 | 2026-04 | Unified quantization, sparsity, pruning, and distillation across PyTorch, TensorFlow, and ONNX (Intel). |
| [NVIDIA TensorRT Model Optimizer](https://github.com/NVIDIA/Model-Optimizer) | 2,396 | 2026-04 | Quantization, pruning, distillation, and speculative decoding optimized for TensorRT and vLLM deployment. |
| [GPTQModel](https://github.com/ModelCloud/GPTQModel) | 1,092 | 2026-04 | LLM quantization toolkit with support for NVIDIA CUDA, AMD ROCm, Intel, and Apple Silicon backends. |

**[⬆ Back to Contents](#contents)**

## Automated Deployment and Serving

*Automated model serving, optimization, and inference infrastructure.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Ollama](https://github.com/ollama/ollama) | 168,025 | 2026-04 | Docker-like local LLM runner for getting models up and running quickly for prototyping. |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | 102,330 | 2026-04 | LLM inference in C/C++ with broad hardware support - the foundation for most local LLM applications. |
| [vLLM](https://github.com/vllm-project/vllm) | 75,592 | 2026-04 | High-throughput LLM serving engine with PagedAttention, powering most open-source LLM deployments in production. |
| [SGLang](https://github.com/sgl-project/sglang) | 25,525 | 2026-04 | High-performance LLM serving framework powering 400K+ GPUs with best-in-class structured and constrained decoding. |
| [ONNX Runtime](https://github.com/microsoft/onnxruntime) | 19,784 | 2026-04 | Cross-platform inference accelerator supporting PyTorch, TensorFlow, scikit-learn, and XGBoost via the ONNX format (Microsoft). |
| [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) | 13,314 | 2026-04 | High-performance LLM inference library with custom attention kernels, speculative decoding, and MoE support (NVIDIA). |
| [Triton Inference Server](https://github.com/triton-inference-server/server) | 10,525 | 2026-04 | Multi-framework inference serving for TensorRT, PyTorch, ONNX, and custom backends (NVIDIA). |
| [OpenVINO](https://github.com/openvinotoolkit/openvino) | 10,024 | 2026-04 | Inference optimization and deployment toolkit for CPUs, GPUs, and edge accelerators (Intel). |
| [BentoML](https://github.com/bentoml/BentoML) | 8,561 | 2026-04 | Build production-ready inference APIs, batch jobs, and multi-model pipelines with unified Python framework. |
| [LMDeploy](https://github.com/InternLM/lmdeploy) | 7,757 | 2026-04 | Toolkit for compressing, deploying, and serving large language and vision-language models. |
| [KServe](https://github.com/kserve/kserve) | 5,300 | 2026-04 | Kubernetes-native standardized model serving with canary rollouts, autoscaling, and multi-framework support (CNCF Incubating). |
| [ExecuTorch](https://github.com/pytorch/executorch) | 4,480 | 2026-04 | On-device AI inference for mobile, embedded, and edge platforms with a 50KB base runtime footprint (Meta). |
| [LitServe](https://github.com/Lightning-AI/LitServe) | 3,859 | 2026-04 | Minimal, high-performance Python framework for AI model serving (Lightning AI). |

**[⬆ Back to Contents](#contents)**

## Automated Monitoring and Observability

*Automated drift detection, performance monitoring, and quality assurance for deployed models.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Evidently](https://github.com/evidentlyai/evidently) | 7,374 | 2026-03 | ML and LLM observability with 100+ metrics for evaluating, testing, and monitoring any AI system in production. |
| [Giskard](https://github.com/Giskard-AI/giskard-oss) | 5,224 | 2026-04 | Testing and evaluation for ML and LLM models covering bias, performance regression, and security vulnerabilities. |
| [Deepchecks](https://github.com/deepchecks/deepchecks) | 4,002 | 2025-12 | Holistic ML validation covering data integrity, drift detection, and model evaluation in a single suite. |
| [WhyLogs](https://github.com/whylabs/whylogs) | 2,811 | 2025-01 | Lightweight data logging library that profiles datasets for drift detection without storing raw data. **Unmaintained — no commits for 12+ months.** |
| [Alibi Detect](https://github.com/SeldonIO/alibi-detect) | 2,509 | 2025-12 | Outlier, adversarial, and drift detection algorithms for tabular, text, image, and time-series data (Seldon). |
| [NannyML](https://github.com/NannyML/nannyml) | 2,136 | 2025-07 | Estimate model performance without ground truth labels and link data drift directly to accuracy degradation. |

**[⬆ Back to Contents](#contents)**

## Automated AI Safety

*Automated testing, red-teaming, and guardrails for ensuring AI system safety and reliability.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Garak](https://github.com/NVIDIA/garak) | 7,487 | 2026-04 | LLM vulnerability scanner with 100+ attack modules covering prompt injection, data leakage, and jailbreaking. |
| [Guardrails AI](https://github.com/guardrails-ai/guardrails) | 6,645 | 2026-04 | Framework for adding structural and semantic validation guardrails to LLM outputs. |
| [Plano](https://github.com/katanemo/plano) | 6,222 | 2026-04 | AI-native proxy with built-in orchestration, safety controls, and observability for agentic applications. |
| [NeMo Guardrails](https://github.com/NVIDIA-NeMo/Guardrails) | 5,935 | 2026-04 | Programmable safety rails for LLM-based conversational systems with topical and safety controls (NVIDIA). |
| [DeepTeam](https://github.com/confident-ai/deepteam) | 1,488 | 2026-04 | Red-teaming framework for systematically testing LLM vulnerabilities across multiple attack vectors. |

**[⬆ Back to Contents](#contents)**

## AutoML Benchmarks

*Standardized frameworks and datasets for evaluating and comparing AutoML systems.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [MLE-Bench](https://github.com/openai/mle-bench) | 1,448 | 2026-03 | Benchmark using 75 Kaggle competitions to evaluate ML engineering agents (OpenAI). |
| [NAS-Bench-101](https://github.com/google-research/nasbench) | 717 | 2023-05 | Benchmark dataset with 423,624 evaluated neural architectures for efficient NAS research (Google). **Archived.** |
| [NAS-Bench-201](https://github.com/D-X-Y/NAS-Bench-201) | 644 | 2025-10 | Reproducible benchmark with 15,625 evaluated architectures across three datasets for fair NAS comparison. |
| [AMLB](https://github.com/openml/automlbenchmark) | 458 | 2026-04 | Standard AutoML benchmark comparing frameworks across 104 classification and regression tasks (OpenML). |
| [TabArena](https://github.com/autogluon/tabarena) | 207 | 2026-04 | Living benchmark for tabular ML with continuously maintained leaderboard and best-practice evaluation (NeurIPS 2025 Spotlight). |

**[⬆ Back to Contents](#contents)**

## MLOps and Experiment Tracking

*Platforms for managing the ML lifecycle, tracking experiments, and orchestrating pipelines.*

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [Ray](https://github.com/ray-project/ray) | 42,001 | 2026-04 | Unified AI compute engine for distributed training, tuning, and model serving with Ray Train, Ray Tune, and Ray Serve. |
| [MLflow](https://github.com/mlflow/mlflow) | 25,181 | 2026-04 | End-to-end ML lifecycle platform with experiment tracking, model registry, and integrated prompt optimization. |
| [Langfuse](https://github.com/langfuse/langfuse) | 24,477 | 2026-04 | Open-source LLM engineering platform with tracing, evaluations, prompt management, and cost analytics. |
| [Prefect](https://github.com/PrefectHQ/prefect) | 22,090 | 2026-04 | Modern data workflow automation with retries, caching, and real-time logging. |
| [Opik](https://github.com/comet-ml/opik) | 18,696 | 2026-04 | LLM debugging, evaluation, and monitoring platform with detailed tracing and quality dashboards (Comet). |
| [Kubeflow](https://github.com/kubeflow/kubeflow) | 15,557 | 2026-01 | ML toolkit on Kubernetes for building portable, scalable ML pipelines and training workflows. |
| [DVC](https://github.com/treeverse/dvc) | 15,510 | 2026-04 | Version control for data and models with built-in experiment tracking and pipeline management. |
| [Dagster](https://github.com/dagster-io/dagster) | 15,245 | 2026-04 | Asset-centric orchestration built for ML pipelines with data lineage tracking and observability. |
| [W&B](https://github.com/wandb/wandb) | 10,972 | 2026-04 | Experiment tracking, visualization, and collaboration platform for ML teams (Weights and Biases). |
| [Kedro](https://github.com/kedro-org/kedro) | 10,811 | 2026-04 | Framework for reproducible, maintainable ML pipelines with clean coding patterns. |
| [Metaflow](https://github.com/Netflix/metaflow) | 10,016 | 2026-04 | Human-centric framework for managing real-life data science and ML projects at scale (Netflix). |
| [Phoenix](https://github.com/Arize-ai/phoenix) | 9,195 | 2026-04 | AI observability platform with OpenTelemetry-native tracing and LLM evaluation dashboards (Arize). |
| [Feast](https://github.com/feast-dev/feast) | 6,913 | 2026-04 | Open-source feature store for managing and serving ML features in real-time and batch inference. |
| [ClearML](https://github.com/clearml/clearml) | 6,612 | 2026-04 | Unified experiment manager, pipeline orchestrator, and data/model management platform. |
| [Aim](https://github.com/aimhubio/aim) | 6,076 | 2026-04 | Self-hosted experiment tracker with a high-performance UI that handles 10,000+ training runs. |
| [ZenML](https://github.com/zenml-io/zenml) | 5,319 | 2026-04 | Framework for building portable, production-ready ML pipelines that run on any infrastructure. |

**[⬆ Back to Contents](#contents)**

## Related Awesome Lists

| Project | Stars | Updated | Description |
|:--------|:------|:--------|:------------|
| [awesome-machine-learning](https://github.com/josephmisiti/awesome-machine-learning) | 72,188 | 2026-03 | Curated list of ML frameworks, libraries, and software organized by language. |
| [awesome-deep-learning](https://github.com/ChristosChristofidis/awesome-deep-learning) | 27,863 | 2025-05 | Curated list of deep learning tutorials, projects, and communities. |
| [awesome-llm](https://github.com/Hannibal046/Awesome-LLM) | 26,610 | 2025-07 | Curated list of large language model resources covering papers, tools, and applications. |
| [awesome-production-machine-learning](https://github.com/EthicalML/awesome-production-machine-learning) | 20,346 | 2026-04 | Curated list of tools for deploying, monitoring, and scaling ML in production. |
| [awesome-mlops](https://github.com/visenger/awesome-mlops) | 13,844 | 2024-11 | Curated list of MLOps tools and best practices for production ML. **Unmaintained — no commits for 12+ months.** |
| [awesome-generative-ai](https://github.com/steven2358/awesome-generative-ai) | 11,775 | 2026-04 | Curated list of modern generative AI projects and services. |

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
