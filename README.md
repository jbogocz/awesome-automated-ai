<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/logo-dark.svg">
  <img alt="Awesome Automated AI/ML logo" src="docs/assets/logo.svg" width="180" height="180">
</picture>

# Awesome Automated AI/ML

A curated list of tools for Automated AI/ML - from hyperparameter optimization to autonomous AI agents.

[![Views](https://hits.sh/github.com/jbogocz/awesome-automated-ai.svg?style=flat-square&label=views&color=2f6feb)](https://hits.sh/github.com/jbogocz/awesome-automated-ai/)
[![GitHub stars](https://img.shields.io/github/stars/jbogocz/awesome-automated-ai?style=flat-square&color=2f6feb)](https://github.com/jbogocz/awesome-automated-ai/stargazers)
[![Version](https://img.shields.io/github/package-json/v/jbogocz/awesome-automated-ai?style=flat-square&label=version&color=2f6feb)](https://github.com/jbogocz/awesome-automated-ai/releases/latest)
[![License: CC0 + MIT](https://img.shields.io/badge/license-CC0_+_MIT-2f6feb?style=flat-square)](LICENSE)
[![Tools](https://img.shields.io/badge/tools-300+-2f6feb?style=flat-square)](#contents)

</div>

<div align="center">

### **[> Explore interactively <](https://jbogocz.github.io/awesome-automated-ai)**

302 entries across 25 categories in 7 sections

</div>

> [!TIP]
> ### Why this list exists
>
> Most curated lists are a snapshot of the day someone wrote them. This one is rebuilt weekly from live GitHub data, which matters because the field moved:
>
> - **Foundation models replaced entire ML pipelines** - TabPFN beats tuned baselines on small tabular data in seconds ([Nature, 2024](https://www.nature.com/articles/s41586-024-08328-6)).
> - **Autonomous AI agents** now run hundreds of ML experiments overnight without human intervention.
> - **Prompt engineering became prompt optimization** - DSPy outperforms expert-written prompts by up to 46% ([ICLR, 2024](https://arxiv.org/abs/2310.03714)).
> - **ML engineering itself got automated** - from data labeling to deployment to monitoring.
>
> This list covers both the classical tools that still power production ML and the new wave that is replacing them.

### Who this is for

- **ML engineers** automating training, evaluation, and deployment pipelines
- **AI researchers** tracking automated experimentation, NAS, and agentic ML
- **Product builders** using foundation models to skip traditional ML entirely
- **Anyone** who wants machines to do the machine learning

## Contents

<!-- Category TOC is generated from src/categories.yaml + projects.yaml at
     generate time — edit those files, not this block. -->
<!-- toc:begin -->

**Build AutoML**
- [General-Purpose AutoML](#general-purpose-automl) (24)
- [Neural Architecture Search](#neural-architecture-search) (6)
- [Hyperparameter Optimization](#hyperparameter-optimization) (10)
- [Automated Feature Engineering](#automated-feature-engineering) (8)
- [Tabular Foundation Models](#tabular-foundation-models) (9)
- [AutoML Benchmarks](#automl-benchmarks) (6)

**Build with LLMs**
- [Automated Fine-Tuning](#automated-fine-tuning) (14)
- [Automated Prompt Optimization](#automated-prompt-optimization) (9)

**Build Agents**
- [Agent Frameworks](#agent-frameworks) (31)
- [Coding Agents](#coding-agents) (18)
- [ML and Research Agents](#ml-and-research-agents) (17)

**Evaluate & Monitor AI**
- [LLM Evaluation and Testing](#llm-evaluation-and-testing) (14)
- [LLM Gateways and Routers](#llm-gateways-and-routers) (7)
- [Automated Monitoring and Observability](#automated-monitoring-and-observability) (8)
- [Automated AI Safety](#automated-ai-safety) (7)

**ML Lifecycle**
- [Time-Series AutoML](#time-series-automl) (15)
- [Automated Data Preprocessing](#automated-data-preprocessing) (9)
- [Automated Data Labeling](#automated-data-labeling) (9)
- [Synthetic Data Generation](#synthetic-data-generation) (6)
- [Automated Model Compression](#automated-model-compression) (10)
- [MLOps and Experiment Tracking](#mlops-and-experiment-tracking) (16)

**Deploy AI**
- [Model Serving](#model-serving) (9)
- [LLM Inference Runtimes](#llm-inference-runtimes) (11)

**Research & Reference**
- [Papers and Surveys](#papers-and-surveys) (22)
- [Related Awesome Lists](#related-awesome-lists) (7)

<!-- toc:end -->

**Resources**
- [Research Notes by Topic](#research-notes-by-topic)
- [Books and Courses](#books-and-courses) (3)
- [Conferences and Communities](#conferences-and-communities) (4)

### Legend

| Symbol | Meaning |
|:-------|:--------|
| :green_circle: :yellow_circle: :red_circle: | Project health: active (fresh mainline commits, plus stable releases still shipping for projects that ship at all) / quiet (slow, coasting, or no stable release in 2 years) / dead (archived or silent for 12+ months) |
| :white_circle: | Stats pending - new entry awaiting its first weekly data refresh |
| :1st_place_medal: :2nd_place_medal: :3rd_place_medal: **4** **5** | Rank within the category by quality score |
| `Score 72/100` (inside an entry) | Quality score: stars 50%, trend 25%, freshness 15%, license 10%; archived repos score 0 |
| :star: 11.7K | GitHub stars |
| :arrow_upper_right: +340 :arrow_lower_right: -286 | Stars gained or lost since the measured snapshot nearest 30 days ago (shown when the change is at least 10 either way); each entry states the window it actually covers. Blank until an entry has two measurements 30 days apart |
| :zzz: | Retired - archived upstream, or no sign of life for 12+ months |
| :file_cabinet: | Historical - included for foundational influence |
| :page_facing_up: | Paper or survey rather than a tool |
| :office: | Commercial enterprise platform (vendor product) |
| `Apache-2.0` | SPDX license identifier |

> Click any project to expand its full dashboard with quality bar, exact stats, and tags.

## General-Purpose AutoML

*End-to-end frameworks that automate model selection, hyperparameter tuning, and pipeline construction. Covers both open-source libraries and enterprise commercial platforms.*

<details><summary>🟢 🥇 <b><a href="https://github.com/autogluon/autogluon">AutoGluon</a></b> <code>⭐ 10.6K</code> <code>↗️ +66</code> <code>Apache-2.0</code> Multi-modal stack ensembling, Kaggle champion</summary>

<br>

Multi-layer stack ensembling for tabular, text, image, time-series, and multimodal data - won medals in 15/18 Kaggle tabular contests in 2024 (Amazon).

```
  Score     72/100
  Stars     ⭐ 10,611 (+66 last 32d, +15 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      hyperparameter-optimization · time-series · forecasting · automated-machine-learning · tabular-data
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/astroautomata/PySR">PySR</a></b> <code>⭐ 3.7K</code> <code>↗️ +101</code> <code>Apache-2.0</code> Automated interpretable equation discovery from data</summary>

<br>

High-performance symbolic regression that automatically discovers interpretable equations from data, with a multi-population evolutionary engine in Julia and a scikit-learn-style Python API. A favorite in scientific ML.

```
  Score     72/100
  Stars     ⭐ 3,727 (+101 last 32d, +40 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      symbolic-regression · automl · equation-discovery · genetic-algorithm · interpretable-ml
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/ludwig-ai/ludwig">Ludwig</a></b> <code>⭐ 11.7K</code> <code>Apache-2.0</code> Declarative deep learning via YAML configs</summary>

<br>

Declarative deep learning framework supporting custom model building and LLM fine-tuning via YAML configs. Now under Linux Foundation AI & Data.

```
  Score     71/100
  Stars     ⭐ 11,746 (+4 last 32d, -2 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      fine-tuning · llama · ml · computer-vision · natural-language-processing
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/h2oai/h2o-3">H2O AutoML</a></b> <code>⭐ 7.5K</code> <code>Apache-2.0</code> Enterprise distributed AutoML with time limits</summary>

<br>

Distributed machine learning platform with automatic training and tuning of many models within a user-specified time limit.

```
  Score     70/100
  Stars     ⭐ 7,495 (-5 last 32d, -8 last 7d)
  Activity  🟢 Aug 2026
  License   Apache-2.0
  Tags      gpu · random-forest · distributed · big-data · ensemble-learning
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/microsoft/FLAML">FLAML</a></b> <code>⭐ 4.4K</code> <code>↗️ +10</code> <code>MIT</code> Fast AutoML with minimal compute resources</summary>

<br>

Fast and lightweight AutoML that finds good models with minimal resources - often the best choice for resource-constrained environments (Microsoft).

```
  Score     68/100
  Stars     ⭐ 4,389 (+10 last 32d, +4 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      hyperparameter-optimization · automated-machine-learning · tabular-data · scikit-learn · natural-language-processing
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/mljar/mljar-supervised">MLJAR Supervised</a></b> <code>⭐ 3.3K</code> <code>MIT</code> AutoML with per-model reports and explanations</summary>

<br>

Automated ML with automatic explanations, visualizations, and Markdown reports for every trained model.

```
  Score     65/100
  Stars     ⭐ 3,285 (+9 last 32d, +5 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Jul 2026
  License   MIT
  Tags      hyperparameter-optimization · automated-machine-learning · scikit-learn · feature-engineering · neural-network
```

</details>

<details><summary>🟡 <b>7</b> <b><a href="https://github.com/pycaret/pycaret">PyCaret</a></b> <code>⭐ 9.8K</code> <code>NOASSERTION</code> Low-code AutoML from training to deployment</summary>

<br>

Low-code machine learning library that automates model training, tuning, and deployment workflows in Python. **No stable release for 24+ months.**

```
  Score     61/100
  Stars     ⭐ 9,832 (+5 last 32d, -2 last 7d)
  Activity  🟡 May 2026
  Release   📦 Apr 2024
  License   NOASSERTION
  Tags      time-series · ml · classification · gpu · regression
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/shankarpandala/lazypredict">LazyPredict</a></b> <code>⭐ 3.3K</code> <code>MIT</code> Dozens of sklearn models in one line</summary>

<br>

Build and evaluate dozens of scikit-learn models in a single line of code for rapid baseline comparison.

```
  Score     60/100
  Stars     ⭐ 3,344 (+7 last 32d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      classification · regression
```

</details>

<details><summary>🟡 <b>9</b> <b><a href="https://github.com/keras-team/autokeras">AutoKeras</a></b> <code>⭐ 9.3K</code> <code>Apache-2.0</code> Neural architecture search built on Keras</summary>

<br>

Neural architecture search for deep learning models built on top of Keras. **Quiet - no commits for 6+ months.**

```
  Score     59/100
  Stars     ⭐ 9,325 (+1 last 32d, -1 last 7d)
  Activity  🟡 Nov 2025
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      automated-machine-learning · tensorflow · neural-architecture-search · keras
```

</details>

<details><summary>🟡 <b>10</b> <b><a href="https://github.com/EpistasisLab/tpot">TPOT</a></b> <code>⭐ 10.1K</code> <code>LGPL-3.0</code> Genetic programming pipeline optimizer for sklearn</summary>

<br>

Genetic programming-based pipeline optimizer that designs and optimizes scikit-learn pipelines. **Quiet - no commits for 6+ months.**

```
  Score     57/100
  Stars     ⭐ 10,051 (+3 last 32d, 0 last 7d)
  Activity  🟡 Sep 2025
  Release   📦 Jul 2025
  License   LGPL-3.0
  Tags      hyperparameter-optimization · automated-machine-learning · scikit-learn · feature-engineering · random-forest
```

</details>

<details><summary>🟡 <b>11</b> <b><a href="https://github.com/sb-ai-lab/LightAutoML">LightAutoML</a></b> <code>⭐ 1.5K</code> <code>Apache-2.0</code> Fast customizable AutoML with Kaggle wins</summary>

<br>

Fast and customizable AutoML framework with Kaggle-winning performance (Sber AI Lab). **Quiet - no commits for 6+ months.**

```
  Score     53/100
  Stars     ⭐ 1,472 (+6 last 32d, +2 last 7d)
  Activity  🟡 Dec 2025
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      automated-machine-learning · nlp · regression · kaggle
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/sapientml/sapientml">SapientML</a></b> <code>⭐ 447</code> <code>Apache-2.0</code> Generative AutoML from corpus of ML solutions</summary>

<br>

Generative AutoML that synthesizes pipelines by learning from a corpus of existing ML solutions.

```
  Score     50/100
  Stars     ⭐ 447 (-3 last 32d, -3 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      automated-machine-learning · automl-python
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/automl/auto-sklearn">auto-sklearn</a></i> <code>⭐ 8.1K</code> <code>BSD-3-Clause</code> Bayesian optimization and meta-learning AutoML</summary>

<br>

*Historically important AutoML toolkit using Bayesian optimization, meta-learning, and ensemble construction. **Superseded by AutoGluon and Optuna for new work.***

```
  Score     55/100
  Stars     ⭐ 8,126 (n/a)
  Activity  🔴 Apr 2023 - unmaintained 12+ months
  Release   📦 Feb 2023
  License   BSD-3-Clause
  Tags      hyperparameter-optimization · automated-machine-learning · scikit-learn · bayesian-optimization · hyperparameter-tuning
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/alteryx/evalml">EvalML</a></i> <code>⭐ 852</code> <code>BSD-3-Clause</code> AutoML pipelines with domain-specific objectives</summary>

<br>

*AutoML library for building, optimizing, and evaluating ML pipelines with domain-specific objectives (Alteryx). **AutoGluon and FLAML cover the same ground for new work.***

```
  Score     48/100
  Stars     ⭐ 852 (n/a)
  Activity  🔴 Nov 2024 - unmaintained 12+ months
  Release   📦 Jun 2024
  License   BSD-3-Clause
  Tags      feature-engineering · optimization · hyperparameter-tuning · feature-selection · model-selection
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/amore-labs/gama">GAMA</a></i> <code>⭐ 107</code> <code>Apache-2.0</code> Genetic programming and Bayesian pipeline optimization</summary>

<br>

*AutoML tool that generates optimized ML pipelines using genetic programming and Bayesian optimization (OpenML). **Research AutoML; AutoGluon and FLAML cover production use.***

```
  Score     41/100
  Stars     ⭐ 107 (n/a)
  Activity  🔴 Sep 2024 - unmaintained 12+ months
  Release   📦 Jun 2024
  License   Apache-2.0
  Tags      hyperparameter-optimization
```

</details>

<details><summary>🔴 🗄️ <i><a href="https://github.com/automl/autoweka">Auto-WEKA</a></i> <code>⭐ 334</code> Original AutoML combining algorithm selection and HPO</summary>

<br>

*The original AutoML system (2013) combining algorithm selection and HPO in WEKA. **Java-only; of interest for the original AutoML formulation.***

```
  Score     34/100
  Stars     ⭐ 334 (n/a)
  Activity  🔴 Mar 2022 - historical
  Release   📦 Mar 2022
  License   -
  Tags      hyperparameter-optimization · bayesian-optimization · model-selection · java
```

</details>

---

<details><summary>🏢 <b><a href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/training-overview">Vertex AI AutoML</a></b> Managed AutoML across data types on Google Cloud</summary>

<br>

Google Cloud's managed AutoML service for training tabular classification, regression, forecasting, image, and video models with one-click endpoint deployment. Now part of the Gemini Enterprise Agent Platform.

```
  Vendor    Google
  Pricing   pay-as-you-go
```

</details>

<details><summary>🏢 <b><a href="https://azure.microsoft.com/en-us/solutions/automated-machine-learning">Azure Machine Learning AutoML</a></b> Automated ML inside Azure Machine Learning workspaces</summary>

<br>

Microsoft's automated ML service inside Azure ML workspaces covering classification, regression, forecasting, computer vision, and NLP, accessible via SDK v2, CLI v2, and the studio UI.

```
  Vendor    Microsoft
  Pricing   pay-as-you-go
```

</details>

<details><summary>🏢 <b><a href="https://aws.amazon.com/sagemaker/ai/autopilot/">Amazon SageMaker Autopilot</a></b> AWS AutoML via SageMaker Canvas and API v2</summary>

<br>

AWS AutoML service that runs feature engineering, algorithm selection, and tuning for tabular, text, image, and time-series tasks, now surfaced primarily through the SageMaker Canvas no-code UI and the AutoML v2 REST API.

```
  Vendor    Amazon Web Services
  Pricing   pay-as-you-go
```

</details>

<details><summary>🏢 <b><a href="https://h2o.ai/platform/ai-cloud/make/h2o-driverless-ai/">H2O Driverless AI</a></b> Commercial AutoML with feature engineering and interpretability</summary>

<br>

H2O.ai's commercial AutoML platform that automates feature engineering, model tuning, interpretability, and deployment for tabular, time-series, image, and text data, deployable on-prem, in cloud, or hybrid.

```
  Vendor    H2O.ai
  Pricing   enterprise
```

</details>

<details><summary>🏢 <b><a href="https://www.datarobot.com/">DataRobot</a></b> Enterprise platform for predictive, generative, and agentic AI</summary>

<br>

Enterprise AI platform for building, deploying, governing, and monitoring predictive, generative, and agentic models, with AutoML, MLOps, and compute orchestration expanded via the 2025 Agnostiq acquisition.

```
  Vendor    DataRobot
  Pricing   enterprise
```

</details>

<details><summary>🏢 <b><a href="https://docs.databricks.com/aws/en/machine-learning/automl/">Databricks AutoML</a></b> Lakehouse AutoML producing editable training notebooks</summary>

<br>

AutoML capability in the Databricks Lakehouse for regression, classification, and forecasting that trains multiple models with scikit-learn, XGBoost, LightGBM, Prophet, and ARIMA and generates editable training notebooks.

```
  Vendor    Databricks
  Pricing   enterprise
```

</details>

<details><summary>🏢 <b><a href="https://www.dataiku.com/product/machine-learning">Dataiku Visual ML</a></b> Visual AutoML inside the Dataiku data platform</summary>

<br>

AutoML and visual ML inside the Dataiku data platform covering classification, regression, forecasting, unsupervised learning, image classification, and object detection, with automated diagnostics, fairness analysis, and MLOps integration.

```
  Vendor    Dataiku
  Pricing   enterprise
```

</details>

<details><summary>🏢 <b><a href="https://www.snowflake.com/en/product/features/cortex/">Snowflake Cortex ML Functions</a></b> SQL-native ML and forecasting on Snowflake data</summary>

<br>

SQL-accessible ML functions in Snowflake Cortex that train and serve forecasting, classification, and anomaly-detection models directly on warehouse data without moving it, complemented by the Cortex Code agent for data-science workflows.

```
  Vendor    Snowflake
  Pricing   pay-as-you-go
```

</details>


**[⬆ Back to Contents](#contents)**

## Neural Architecture Search

*Automated search for optimal neural network architectures using reinforcement learning, evolution, gradient-based methods, or LLM-guided search.*

<details><summary>🟡 🥇 <b><a href="https://github.com/microsoft/archai">Archai</a></b> <code>⭐ 485</code> <code>MIT</code> Modular NAS framework for reproducible research</summary>

<br>

Modular NAS framework for reproducible architecture search research (Microsoft). **Quiet - no commits for 6+ months.**

```
  Score     48/100
  Stars     ⭐ 485 (0 last 32d, 0 last 7d)
  Activity  🟡 Nov 2025
  Release   📦 Sep 2023
  License   MIT
  Tags      hyperparameter-optimization · automated-machine-learning · neural-architecture-search · model-compression · nas
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/automl/Auto-PyTorch">AutoPyTorch</a></i> <code>⭐ 2.5K</code> <code>Apache-2.0</code> Joint NAS and HPO for PyTorch from Auto-sklearn team</summary>

<br>

*Joint NAS and HPO for PyTorch from the AutoML Freiburg group behind auto-sklearn, combining BOHB with meta-learning and portfolio selection. **Auto-sklearn's PyTorch sibling; AutoGluon covers the same ground today.***

```
  Score     51/100
  Stars     ⭐ 2,541 (n/a)
  Activity  🔴 Aug 2022 - unmaintained 12+ months
  Release   📦 Aug 2022
  License   Apache-2.0
  Tags      hyperparameter-optimization · automated-machine-learning · neural-architecture-search
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/mit-han-lab/tinyengine">TinyEngine</a></i> <code>⭐ 952</code> <code>MIT</code> Inference engine for NAS models on microcontrollers</summary>

<br>

*Memory-efficient inference engine for NAS-optimized models on microcontrollers (MIT HAN Lab). **Reference implementation behind the TinyML papers.***

```
  Score     48/100
  Stars     ⭐ 952 (n/a)
  Activity  🔴 Nov 2024 - unmaintained 12+ months
  License   MIT
  Tags      quantization · neural-architecture-search
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/automl/NASLib">NASLib</a></i> <code>⭐ 595</code> <code>Apache-2.0</code> NAS research library with standardized search spaces</summary>

<br>

*NAS research library from AutoML Freiburg with interfaces to state-of-the-art search spaces and optimizers. **Reference implementation; NAS-Bench-201 remains the usable benchmark.***

```
  Score     46/100
  Stars     ⭐ 595 (n/a)
  Activity  🔴 Jul 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      neural-architecture-search · nas
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/microsoft/nni">NNI</a></i> <code>⭐ 14.4K</code> <code>MIT</code> Comprehensive NAS, HPO, and model compression toolkit</summary>

<br>

*Comprehensive AutoML toolkit for NAS, hyperparameter tuning, feature engineering, and model compression. **Archived by Microsoft; Optuna or Ray Tune for new work.***

```
  Score     0/100
  Stars     ⭐ 14,363 (n/a)
  Activity  🔴 Oct 2023 - archived
  Release   📦 Sep 2023
  License   MIT
  Tags      mlops · hyperparameter-optimization · automated-machine-learning · tensorflow · feature-engineering
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/google/automl">Google AutoML</a></i> <code>⭐ 6.5K</code> <code>Apache-2.0</code> Research code behind EfficientNet and EfficientDet</summary>

<br>

*Research code for EfficientNet, EfficientDet, MnasNet, and other NAS-discovered architectures (Google Brain). **Archived. Research code accompanying the EfficientDet papers, not a supported library.***

```
  Score     0/100
  Stars     ⭐ 6,475 (n/a)
  Activity  🔴 Mar 2025 - archived
  Release   📦 Mar 2021
  License   Apache-2.0
  Tags      object-detection
```

</details>


**[⬆ Back to Contents](#contents)**

## Hyperparameter Optimization

*Libraries dedicated to finding optimal hyperparameters via Bayesian optimization, bandits, evolutionary search, or population-based training.*

<details><summary>🟢 🥇 <b><a href="https://docs.ray.io/en/latest/tune/">Ray Tune</a></b> <code>⭐ 43.6K</code> <code>↗️ +287</code> <code>Apache-2.0</code> Distributed HPO at scale for any ML framework</summary>

<br>

Distributed hyperparameter tuning at scale with support for any ML framework and many search algorithms. Ships inside the Ray repository, so its stars and activity are Ray's.

```
  Score     77/100
  Stars     ⭐ 43,576 (+287 last 32d, +63 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      hyperparameter-optimization · optimization · distributed · hyperparameter-search · parallel
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/optuna/optuna">Optuna</a></b> <code>⭐ 14.7K</code> <code>↗️ +147</code> <code>MIT</code> Most widely adopted HPO framework with pruning</summary>

<br>

Define-by-run API with pruning, distributed execution, and a dashboard - the most widely adopted HPO framework.

```
  Score     74/100
  Stars     ⭐ 14,676 (+147 last 32d, +16 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   MIT
  Tags      hyperparameter-optimization · distributed · parallel
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/meta-pytorch/botorch">BoTorch</a></b> <code>⭐ 3.6K</code> <code>↗️ +16</code> <code>MIT</code> PyTorch Bayesian optimization for multi-objective problems</summary>

<br>

Bayesian optimization library in PyTorch for high-dimensional, noisy, and multi-objective problems (Meta).

```
  Score     68/100
  Stars     ⭐ 3,588 (+16 last 32d, +4 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   MIT
  Tags      hyperparameter-optimization · bayesian-optimization · meta
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/facebook/Ax">Ax</a></b> <code>⭐ 2.8K</code> <code>↗️ +10</code> <code>MIT</code> Adaptive experimentation for multi-objective optimization</summary>

<br>

Adaptive experimentation platform for multi-objective optimization with BoTorch integration (Meta).

```
  Score     67/100
  Stars     ⭐ 2,790 (+10 last 32d, +3 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   MIT
  Tags      hyperparameter-optimization · bayesian-optimization · meta
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/hyperopt/hyperopt">Hyperopt</a></b> <code>⭐ 7.6K</code> <code>NOASSERTION</code> Pioneer of tree-structured Parzen estimators for HPO</summary>

<br>

Pioneered tree-structured Parzen estimators for HPO. **Optuna is the recommended successor for new work.**

```
  Score     64/100
  Stars     ⭐ 7,592 (+1 last 32d, -6 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Jul 2026
  License   NOASSERTION
  Tags      hacktoberfest
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/google/vizier">Google Vizier</a></b> <code>⭐ 1.7K</code> <code>Apache-2.0</code> Open-source interface to Google's internal HPO service</summary>

<br>

Research interface for blackbox and hyperparameter optimization with Bayesian, evolutionary, and multi-objective algorithms based on Google's internal Vizier Service.

```
  Score     64/100
  Stars     ⭐ 1,671 (+5 last 32d, 0 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Feb 2025
  License   Apache-2.0
  Tags      hyperparameter-optimization · open-source · optimization · bayesian-optimization · evolutionary-algorithms
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/kubeflow/katib">Katib</a></b> <code>⭐ 1.7K</code> <code>Apache-2.0</code> Kubernetes-native HPO and NAS for Kubeflow</summary>

<br>

Kubernetes-native hyperparameter tuning and NAS with pluggable algorithms and parallel trials - the HPO layer of Kubeflow.

```
  Score     62/100
  Stars     ⭐ 1,696 (+5 last 32d, +2 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Oct 2025
  License   Apache-2.0
  Tags      hyperparameter-optimization · neural-architecture-search · kubernetes · kubeflow
```

</details>

<details><summary>🟡 <b>8</b> <b><a href="https://github.com/facebookresearch/nevergrad">Nevergrad</a></b> <code>⭐ 4.2K</code> <code>MIT</code> Gradient-free optimization with CMA-ES and evolution</summary>

<br>

Gradient-free optimization toolbox with CMA-ES, differential evolution, and particle swarm - Meta's canonical library for black-box and evolutionary optimization. **Quiet - minimal recent development.**

```
  Score     59/100
  Stars     ⭐ 4,203 (+6 last 32d, +2 last 7d)
  Activity  🟡 Mar 2026
  Release   📦 Apr 2025
  License   MIT
  Tags      hyperparameter-optimization · bayesian-optimization · evolutionary-algorithms · blackbox-optimization
```

</details>

<details><summary>🟡 <b>9</b> <b><a href="https://github.com/keras-team/keras-tuner">Keras Tuner</a></b> <code>⭐ 2.9K</code> <code>Apache-2.0</code> Hyperparameter search for Keras with Bayesian and Hyperband</summary>

<br>

Hyperparameter search for Keras models with built-in Bayesian optimization and Hyperband. **Quiet - no commits for 6+ months.**

```
  Score     55/100
  Stars     ⭐ 2,924 (+2 last 32d, +1 last 7d)
  Activity  🟡 Nov 2025
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      hyperparameter-optimization · tensorflow · keras
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/automl/SMAC3">SMAC3</a></b> <code>⭐ 1.2K</code> <code>NOASSERTION</code> Bayesian HPO with racing mechanisms for algorithm configuration</summary>

<br>

Sequential model-based algorithm configuration combining Bayesian optimization with racing mechanisms (AutoML Freiburg).

```
  Score     53/100
  Stars     ⭐ 1,243 (+8 last 32d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      hyperparameter-optimization · automated-machine-learning · bayesian-optimization · hyperparameter-tuning · random-forest
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Feature Engineering

*Tools that generate, select, and transform features without manual hand-crafting, including LLM-driven feature synthesis for tabular data.*

<details><summary>🟢 🥇 <b><a href="https://github.com/blue-yonder/tsfresh">tsfresh</a></b> <code>⭐ 9.3K</code> <code>↗️ +17</code> <code>MIT</code> Auto-extract hundreds of time-series features with filtering</summary>

<br>

Automatic extraction of hundreds of time-series features with built-in statistical relevance filtering.

```
  Score     67/100
  Stars     ⭐ 9,292 (+17 last 32d, +8 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 May 2026
  License   MIT
  Tags      time-series · feature-extraction
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/4paradigm/OpenMLDB">OpenMLDB</a></b> <code>⭐ 1.7K</code> <code>↗️ +11</code> <code>Apache-2.0</code> SQL-based feature engineering consistent across train and serve</summary>

<br>

Database for consistent feature computation between training and serving with SQL-based feature engineering (SIGMOD 2025).

```
  Score     65/100
  Stars     ⭐ 1,706 (+11 last 32d, +2 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Feb 2025
  License   Apache-2.0
  Tags      mlops · feature-engineering · feature-extraction · feature-store
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/feature-engine/feature_engine">Feature-engine</a></b> <code>⭐ 2.3K</code> <code>↗️ +10</code> <code>BSD-3-Clause</code> Sklearn transformers for feature creation and selection</summary>

<br>

Scikit-learn-compatible transformers for feature creation, selection, encoding, and imputation.

```
  Score     65/100
  Stars     ⭐ 2,269 (+10 last 32d, +2 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Jul 2026
  License   BSD-3-Clause
  Tags      scikit-learn · feature-engineering · feature-selection · feature-extraction
```

</details>

<details><summary>🟡 <b>4</b> <b><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a></b> <code>⭐ 1.1K</code> <code>Apache-2.0</code> GPU-accelerated feature engineering for terabyte tabular data</summary>

<br>

GPU-accelerated feature engineering and preprocessing for terabyte-scale tabular data with automatic hashing, categorification, and normalization (NVIDIA). **No stable release for 24+ months.**

```
  Score     57/100
  Stars     ⭐ 1,150 (+1 last 32d, -1 last 7d)
  Activity  🟡 May 2026
  Release   📦 Aug 2023
  License   Apache-2.0
  Tags      feature-engineering · gpu · feature-selection · nvidia · preprocessing
```

</details>

<details><summary>🟡 <b>5</b> <b><a href="https://github.com/scikit-learn-contrib/boruta_py">Boruta</a></b> <code>⭐ 1.6K</code> <code>BSD-3-Clause</code> All-relevant feature selection via random forest shadows</summary>

<br>

All-relevant feature selection wrapper using random forest shadow features to identify important predictors. **Quiet - no commits for 6+ months.**

```
  Score     52/100
  Stars     ⭐ 1,625 (0 last 32d, 0 last 7d)
  Activity  🟡 Nov 2025
  Release   📦 Aug 2024
  License   BSD-3-Clause
  Tags      tabular-data · scikit-learn · feature-engineering · random-forest · feature-selection
```

</details>

<details><summary>🟡 <b>6</b> <b><a href="https://github.com/cod3licious/autofeat">AutoFeat</a></b> <code>⭐ 546</code> <code>MIT</code> Sklearn-compatible non-linear feature generation and selection</summary>

<br>

Scikit-learn-compatible automated feature engineering and selection that generates non-linear features and selects robust subsets. **Quiet - no commits for 6+ months.**

```
  Score     51/100
  Stars     ⭐ 546 (+3 last 32d, +1 last 7d)
  Activity  🟡 Jan 2026
  License   MIT
  Tags      automated-machine-learning · feature-engineering · feature-selection · automated-feature-engineering
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/alteryx/featuretools">Featuretools</a></i> <code>⭐ 7.7K</code> <code>BSD-3-Clause</code> Deep feature synthesis for relational and temporal data</summary>

<br>

*Deep feature synthesis for automatically creating meaningful features from relational and temporal data (Alteryx). **Still the reference for deep feature synthesis; unmaintained upstream.***

```
  Score     55/100
  Stars     ⭐ 7,664 (n/a)
  Activity  🔴 Nov 2024 - unmaintained 12+ months
  Release   📦 May 2024
  License   BSD-3-Clause
  Tags      automated-machine-learning · scikit-learn · feature-engineering · automated-feature-engineering
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/noahho/CAAFE">CAAFE</a></i> <code>⭐ 198</code> <code>NOASSERTION</code> LLM generates semantically meaningful features with explanations</summary>

<br>

*LLM-powered context-aware feature engineering that generates semantically meaningful features with explanations. **Research code behind the LLM feature-engineering paper.***

```
  Score     41/100
  Stars     ⭐ 198 (n/a)
  Activity  🔴 Dec 2024 - unmaintained 12+ months
  License   NOASSERTION
  Tags      feature-engineering · tabpfn
```

</details>


**[⬆ Back to Contents](#contents)**

## Tabular Foundation Models

*Pretrained models that replace traditional tabular AutoML pipelines with a single forward pass or zero-shot inference on structured data.*

<details><summary>🟢 🥇 <b><a href="https://github.com/google-research/tabfm">TabFM</a></b> <code>⭐ 2.5K</code> <code>Apache-2.0</code> Pretrained tabular foundation model from Google</summary>

<br>

Pretrained tabular foundation model from Google Research for regression and classification without per-dataset training.

```
  Score     76/100
  Stars     ⭐ 2,527 (+36 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      tabular-data · classification · regression · google · foundation-model
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/soda-inria/tabicl">TabICL</a></b> <code>⭐ 1.3K</code> <code>↗️ +85</code> <code>NOASSERTION</code> Tabular foundation model 10x faster than TabPFN</summary>

<br>

State-of-the-art tabular foundation model achieving 10x faster inference than TabPFN v2.5 (ICML 2025).

```
  Score     71/100
  Stars     ⭐ 1,293 (+85 last 32d, +10 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      tabular-data · foundation-models · tabular-methods
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/limix-ldm-ai/LimiX">LimiX</a></b> <code>⭐ 4.0K</code> <code>↗️ +194</code> <code>Apache-2.0</code> Joint variable + missingness modeling with LDM scaling laws</summary>

<br>

Structured-data foundation model that jointly models variables and missingness via a Latent Distribution Model, introducing LDM scaling laws for tabular data.

```
  Score     71/100
  Stars     ⭐ 4,005 (+194 last 32d, +56 last 7d)
  Activity  🟢 Jun 2026
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      tabular-data · foundation-models · structured-data
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/PriorLabs/TabPFN">TabPFN</a></b> <code>⭐ 7.8K</code> <code>↗️ +197</code> <code>NOASSERTION</code> Beats tuned XGBoost in 2.8 seconds flat</summary>

<br>

Tabular foundation model that matches tuned XGBoost in 2.8 seconds with a single forward pass - 100% win rate vs default XGBoost on datasets under 10K rows (Nature 2024, now v2.6 supporting up to 100K rows).

```
  Score     70/100
  Stars     ⭐ 7,826 (+197 last 32d, +34 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      tabular-data · foundation-models · tabpfn
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/layer6ai-labs/TabDPT-inference">TabDPT</a></b> <code>⭐ 109</code> <code>↗️ +10</code> <code>Apache-2.0</code> Scaling tabular foundation models on real data</summary>

<br>

Scales tabular foundation models via pretraining on real data; inference code from "TabDPT, Scaling Tabular Foundation Models on Real Data" (Layer 6 AI).

```
  Score     67/100
  Stars     ⭐ 109 (+10 last 32d, +1 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   Apache-2.0
  Tags      tabular-data · foundation-models
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/LAMDA-Tabular/TALENT">TALENT</a></b> <code>⭐ 849</code> <code>MIT</code> Benchmark toolkit for 35+ tabular deep methods</summary>

<br>

Comprehensive toolkit and benchmark for tabular learning covering 35+ deep methods across 300 datasets.

```
  Score     59/100
  Stars     ⭐ 849 (0 last 32d, -1 last 7d)
  Activity  🟢 Jul 2026
  License   MIT
  Tags      tabular-data · tabular-methods
```

</details>

<details><summary>🟡 <b>7</b> <b><a href="https://github.com/SAP-samples/sap-rpt-1-oss">ConTextTab</a></b> <code>⭐ 184</code> <code>Apache-2.0</code> Semantics-aware ICL trained on real tables</summary>

<br>

Semantics-aware tabular in-context learner (SAP-RPT-1) trained on real-world tabular data rather than purely synthetic priors. **Quiet - minimal recent development.**

```
  Score     56/100
  Stars     ⭐ 184 (+4 last 32d, +1 last 7d)
  Activity  🟡 Jun 2026
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      tabular-data · foundation-models
```

</details>

<details><summary>🟡 <b>8</b> <b><a href="https://github.com/yandex-research/tabm">TabM</a></b> <code>⭐ 1.1K</code> <code>↗️ +17</code> <code>Apache-2.0</code> Efficient MLP ensemble for top tabular performance</summary>

<br>

Parameter-efficient ensemble of MLPs based on BatchEnsemble, achieving top performance among tabular deep learning models without attention complexity (ICLR 2025, Yandex). **Quiet - no commits for 6+ months.**

```
  Score     54/100
  Stars     ⭐ 1,099 (+17 last 32d, +5 last 7d)
  Activity  🟡 Nov 2025
  Release   📦 Aug 2025
  License   Apache-2.0
  Tags      tabular-data · neural-networks
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/soda-inria/carte">CARTE</a></i> <code>⭐ 172</code> <code>BSD-3-Clause</code> LLM-powered representation for heterogeneous tabular data</summary>

<br>

*Context-aware tabular representation using pretrained language models for data with heterogeneous columns. **Research code behind the CARTE paper.***

```
  Score     42/100
  Stars     ⭐ 172 (n/a)
  Activity  🔴 Aug 2025 - unmaintained 12+ months
  License   BSD-3-Clause
  Tags      transformers · classification · regression
```

</details>


**[⬆ Back to Contents](#contents)**

## AutoML Benchmarks

*Standardised benchmarks and evaluation harnesses for comparing AutoML systems and ML agents across tasks and datasets.*

<details><summary>🟢 🥇 <b><a href="https://github.com/autogluon/tabarena">TabArena</a></b> <code>⭐ 286</code> <code>↗️ +17</code> <code>Apache-2.0</code> Living leaderboard for tabular ML best practices</summary>

<br>

Living benchmark for tabular ML with continuously maintained leaderboard and best-practice evaluation (NeurIPS 2025 Spotlight).

```
  Score     68/100
  Stars     ⭐ 286 (+17 last 32d, +3 last 7d)
  Activity  🟢 Aug 2026
  License   Apache-2.0
  Tags      tabular-data · benchmark · autogluon
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/SalesforceAIResearch/gift-eval">GIFT-Eval</a></b> <code>⭐ 250</code> <code>Apache-2.0</code> Time-series forecasting benchmark across seven domains</summary>

<br>

Benchmark for general time-series forecasting across seven domains and frequencies from seconds to years, with a non-leaking pretraining split and a public leaderboard.

```
  Score     66/100
  Stars     ⭐ 250 (+3 last 7d)
  Activity  🟢 Aug 2026
  License   Apache-2.0
  Tags      time-series · evaluation · forecasting · foundation-models · benchmark
```

</details>

<details><summary>🟡 🥉 <b><a href="https://github.com/openai/mle-bench">MLE-Bench</a></b> <code>⭐ 1.7K</code> <code>↗️ +67</code> <code>NOASSERTION</code> 75 Kaggle competitions for evaluating ML agents</summary>

<br>

Benchmark using 75 Kaggle competitions to evaluate ML engineering agents (OpenAI). **Quiet - minimal recent development.**

```
  Score     60/100
  Stars     ⭐ 1,709 (+67 last 32d, +18 last 7d)
  Activity  🟡 Apr 2026
  License   NOASSERTION
  Tags      agents · openai · evaluation · benchmark · ml-engineering
```

</details>

<details><summary>🟡 <b>4</b> <b><a href="https://github.com/D-X-Y/NAS-Bench-201">NAS-Bench-201</a></b> <code>⭐ 644</code> <code>MIT</code> 15,625 architectures across three datasets for fair NAS</summary>

<br>

Reproducible benchmark with 15,625 evaluated architectures across three datasets for fair NAS comparison. **Quiet - no commits for 6+ months.**

```
  Score     48/100
  Stars     ⭐ 644 (-2 last 32d, 0 last 7d)
  Activity  🟡 Oct 2025
  License   MIT
  Tags      dataset · nas
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/openml/automlbenchmark">AMLB</a></i> <code>⭐ 467</code> <code>MIT</code> Standard benchmark comparing AutoML frameworks across 104 tasks</summary>

<br>

*Standard AutoML benchmark comparing frameworks across 104 classification and regression tasks (OpenML). **TabArena is the maintained successor for tabular benchmarking.***

```
  Score     48/100
  Stars     ⭐ 467 (n/a)
  Activity  🔴 Apr 2025 - unmaintained 12+ months
  Release   📦 Sep 2023
  License   MIT
  Tags      benchmark
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/google-research/nasbench">NAS-Bench-101</a></i> <code>⭐ 720</code> <code>Apache-2.0</code> 423,624 evaluated neural architectures for NAS research</summary>

<br>

*Benchmark dataset with 423,624 evaluated neural architectures for efficient NAS research (Google). **Archived. Reference benchmark; use NAS-Bench-201 for new work.***

```
  Score     0/100
  Stars     ⭐ 720 (n/a)
  Activity  🔴 Nov 2019 - archived
  License   Apache-2.0
  Tags      tensorflow · neural-architecture-search · benchmark · google · dataset
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Fine-Tuning

*Tools that automate adapting large language models to specific tasks and domains via SFT, LoRA, QLoRA, DPO, RLHF, and related methods.*

<details><summary>🟢 🥇 <b><a href="https://github.com/unslothai/unsloth">Unsloth</a></b> <code>⭐ 74.2K</code> <code>↗️ +5719</code> <code>Apache-2.0</code> Fine-tune LLMs 2-5x faster, 80% less memory</summary>

<br>

Fine-tune LLMs 2-5x faster with 80% less memory on a single GPU through optimized kernels and custom autograd.

```
  Score     91/100
  Stars     ⭐ 74,164 (+5719 last 32d, +2851 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      openai · agent · llms · fine-tuning · llama
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/hiyouga/LlamaFactory">LLaMA-Factory</a></b> <code>⭐ 74.3K</code> <code>↗️ +889</code> <code>Apache-2.0</code> Unified fine-tuning for 100+ LLMs with web UI</summary>

<br>

Unified fine-tuning framework for 100+ LLMs and VLMs with Full, LoRA, QLoRA, and DoRA methods plus web UI (ACL 2024).

```
  Score     80/100
  Stars     ⭐ 74,275 (+889 last 32d, +191 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 May 2026
  License   Apache-2.0
  Tags      agent · transformers · fine-tuning · large-language-models · llama
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/huggingface/lerobot">LeRobot</a></b> <code>⭐ 26.8K</code> <code>↗️ +828</code> <code>Apache-2.0</code> End-to-end learning for robotics</summary>

<br>

Hugging Face's end-to-end library for robotics learning with pretrained policies, datasets, and simulation environments for imitation and RL.

```
  Score     80/100
  Stars     ⭐ 26,800 (+828 last 32d, +151 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      reinforcement-learning
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/huggingface/peft">PEFT</a></b> <code>⭐ 21.6K</code> <code>↗️ +148</code> <code>Apache-2.0</code> Standard LoRA and parameter-efficient fine-tuning library</summary>

<br>

Standard library for parameter-efficient fine-tuning - LoRA, QLoRA, Spectrum, and more. Deeply integrated with the Hugging Face ecosystem.

```
  Score     75/100
  Stars     ⭐ 21,567 (+148 last 32d, +22 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      transformers · fine-tuning · lora · peft · diffusion
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/huggingface/trl">TRL</a></b> <code>⭐ 19.1K</code> <code>↗️ +229</code> <code>Apache-2.0</code> RLHF, DPO, and GRPO trainers for LLM alignment</summary>

<br>

Transformer Reinforcement Learning with SFT, DPO, RLHF, and GRPO trainers for alignment and preference tuning (Hugging Face).

```
  Score     75/100
  Stars     ⭐ 19,115 (+229 last 32d, +46 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      transformers · fine-tuning · reinforcement-learning · huggingface · rlhf
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/microsoft/agent-lightning">Agent Lightning</a></b> <code>⭐ 17.6K</code> <code>↗️ +186</code> <code>MIT</code> Train and optimize agents with reinforcement learning</summary>

<br>

Trainer that turns agent execution traces into reinforcement-learning signal, optimizing the underlying models with almost zero changes to existing agent code - works with any agent framework (Microsoft).

```
  Score     75/100
  Stars     ⭐ 17,586 (+186 last 32d, +106 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      mlops · fine-tuning · optimization · reinforcement-learning
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/axolotl-ai-cloud/axolotl">Axolotl</a></b> <code>⭐ 12.4K</code> <code>↗️ +163</code> <code>Apache-2.0</code> Production-grade multi-GPU fine-tuning framework</summary>

<br>

Production-grade fine-tuning with multi-GPU support, sequence parallelism, and multimodal capabilities.

```
  Score     74/100
  Stars     ⭐ 12,380 (+163 last 32d, +23 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      fine-tuning
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/Lightning-AI/litgpt">LitGPT</a></b> <code>⭐ 13.6K</code> <code>↗️ +128</code> <code>Apache-2.0</code> Pretrain, fine-tune, and deploy 20+ LLM architectures</summary>

<br>

Recipes for pretraining, fine-tuning, and deploying 20+ LLM architectures on your own data (Lightning AI).

```
  Score     73/100
  Stars     ⭐ 13,619 (+128 last 32d, +3 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   Apache-2.0
  Tags      llms · large-language-models · artificial-intelligence · llm-inference
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/h2oai/h2o-llmstudio">H2O LLM Studio</a></b> <code>⭐ 5.2K</code> <code>↗️ +130</code> <code>Apache-2.0</code> No-code GUI for LLM fine-tuning and RLHF</summary>

<br>

No-code GUI for fine-tuning LLMs with SFT, DPO, and RLHF, plus experiment tracking and one-click Hugging Face Hub export (H2O.ai).

```
  Score     73/100
  Stars     ⭐ 5,170 (+130 last 32d, +7 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      generative-ai · fine-tuning · llama · gpt · chatgpt
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/OptimalScale/LMFlow">LMFlow</a></b> <code>⭐ 8.5K</code> <code>Apache-2.0</code> Extensible fine-tuning toolkit, NAACL 2024 award</summary>

<br>

Extensible toolkit for fine-tuning and inference of large foundation models, NAACL 2024 Best Demo Award.

```
  Score     69/100
  Stars     ⭐ 8,484 (-2 last 32d, 0 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      chatgpt · transformer · pretrained-models · language-model
```

</details>

<details><summary>🟡 <b>11</b> <b><a href="https://github.com/meta-pytorch/torchtune">torchtune</a></b> <code>⭐ 5.8K</code> <code>↗️ +17</code> <code>BSD-3-Clause</code> Native PyTorch LLM fine-tuning with YAML configs</summary>

<br>

Native PyTorch library for fine-tuning LLMs with composable building blocks and YAML configs (Meta). **Quiet - minimal recent development.**

```
  Score     62/100
  Stars     ⭐ 5,801 (+17 last 32d, +4 last 7d)
  Activity  🟡 Apr 2026
  Release   📦 Apr 2025
  License   BSD-3-Clause
  Tags      fine-tuning · meta
```

</details>

<details><summary>🟡 <b>12</b> <b><a href="https://github.com/predibase/lorax">LoRAX</a></b> <code>⭐ 3.8K</code> <code>↗️ +10</code> <code>Apache-2.0</code> Thousands of LoRA adapters on a single GPU</summary>

<br>

Multi-LoRA inference server that scales to thousands of fine-tuned LLMs on a single GPU (Predibase). **Quiet - minimal recent development.**

```
  Score     62/100
  Stars     ⭐ 3,827 (+10 last 32d, +3 last 7d)
  Activity  🟡 May 2026
  Release   📦 Jan 2025
  License   Apache-2.0
  Tags      llmops · transformers · fine-tuning · llama · gpt
```

</details>

<details><summary>🟡 <b>13</b> <b><a href="https://github.com/huggingface/autotrain-advanced">Hugging Face AutoTrain</a></b> <code>⭐ 4.6K</code> <code>↗️ +20</code> <code>Apache-2.0</code> No-code LLM and vision-language model training</summary>

<br>

No-code training for LLMs, vision-language models, text classification, and tabular data (Hugging Face). **Quiet - minimal recent development.**

```
  Score     61/100
  Stars     ⭐ 4,608 (+20 last 32d, +6 last 7d)
  Activity  🟡 Apr 2026
  License   Apache-2.0
  Tags      natural-language-processing · huggingface
```

</details>

<details><summary>🟡 <b>14</b> <b><a href="https://github.com/mosaicml/llm-foundry">LLM Foundry</a></b> <code>⭐ 4.4K</code> <code>↗️ +11</code> <code>Apache-2.0</code> Composable pretraining and fine-tuning for foundation models</summary>

<br>

Composable building blocks for pretraining, fine-tuning, and evaluating foundation models with efficient distributed training (Databricks). **Quiet - minimal recent development.**

```
  Score     60/100
  Stars     ⭐ 4,440 (+11 last 32d, +2 last 7d)
  Activity  🟡 Mar 2026
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      nlp · neural-networks
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Prompt Optimization

*Systematic optimization of prompts, instructions, and demonstrations to improve LLM performance without manual tuning.*

<details><summary>🟢 🥇 <b><a href="https://github.com/stanfordnlp/dspy">DSPy</a></b> <code>⭐ 37.5K</code> <code>↗️ +1228</code> <code>MIT</code> Automatic prompt optimizers replacing hand-written prompts</summary>

<br>

Declarative framework replacing hand-written prompts with automatic optimizers - GPT-3.5 with DSPy outperforms expert prompts by up to 46% (Stanford NLP).

```
  Score     81/100
  Stars     ⭐ 37,467 (+1228 last 32d, +285 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      nlp · prompt-optimization · dspy
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/gepa-ai/gepa">GEPA</a></b> <code>⭐ 6.2K</code> <code>↗️ +479</code> <code>MIT</code> Reflective Pareto prompt evolution, ICLR 2026 Oral</summary>

<br>

Genetic-Pareto reflective prompt optimizer - outperforms RL methods like GRPO by up to 20% while using 35x fewer rollouts; available as dspy.GEPA (ICLR 2026 Oral).

```
  Score     81/100
  Stars     ⭐ 6,178 (+479 last 32d, +62 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   MIT
  Tags      optimization · prompt-optimization · evolutionary-algorithms
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/Mirascope/mirascope">Mirascope</a></b> <code>⭐ 1.5K</code> <code>MIT</code> Pythonic LLM toolkit with prompt versioning and tracing</summary>

<br>

Pythonic toolkit for building LLM applications with integrated prompt versioning, tracing, and optimization.

```
  Score     64/100
  Stars     ⭐ 1,522 (+5 last 32d, +1 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   MIT
  Tags      developer-tools · artificial-intelligence · typescript · llm-tools
```

</details>

<details><summary>🟡 <b>4</b> <b><a href="https://github.com/SalesforceAIResearch/promptomatix">Promptomatix</a></b> <code>⭐ 973</code> <code>Apache-2.0</code> Task descriptions to optimized prompts automatically</summary>

<br>

DSPy-powered automatic prompt optimization that transforms task descriptions into optimized prompts with cost-aware objectives (Salesforce). **Quiet - minimal recent development.**

```
  Score     58/100
  Stars     ⭐ 973 (+3 last 32d, 0 last 7d)
  Activity  🟡 Jun 2026
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      nlp · prompt-optimization
```

</details>

<details><summary>🟡 <b>5</b> <b><a href="https://github.com/Eladlev/AutoPrompt">AutoPrompt</a></b> <code>⭐ 3.0K</code> <code>↗️ +11</code> <code>Apache-2.0</code> Intent-based iterative prompt calibration with synthetic data</summary>

<br>

Intent-based prompt calibration using synthetic data generation for iterative prompt refinement. **Quiet - no commits for 6+ months.**

```
  Score     56/100
  Stars     ⭐ 3,002 (+11 last 32d, 0 last 7d)
  Activity  🟡 Dec 2025
  Release   📦 Mar 2024
  License   Apache-2.0
  Tags      prompt-engineering · synthetic-dataset-generation
```

</details>

<details><summary>🟡 <b>6</b> <b><a href="https://github.com/meta-llama/prompt-ops">Prompt-Ops</a></b> <code>⭐ 853</code> <code>MIT</code> CLI for building and managing prompts at scale</summary>

<br>

Open-source command-line tool for building, optimizing, and managing prompts at scale (Meta). **Quiet - no commits for 6+ months.**

```
  Score     52/100
  Stars     ⭐ 853 (+5 last 32d, 0 last 7d)
  Activity  🟡 Dec 2025
  License   MIT
  Tags      llama · prompt-engineering · prompt-optimization · meta
```

</details>

<details><summary>🟡 <b>7</b> <b><a href="https://github.com/beeevita/EvoPrompt">EvoPrompt</a></b> <code>⭐ 249</code> <code>MIT</code> Evolutionary algorithms for discrete prompt optimization</summary>

<br>

Connects LLMs with evolutionary algorithms for discrete prompt optimization with up to 25% improvement over manual prompts. **Quiet - no commits for 6+ months.**

```
  Score     46/100
  Stars     ⭐ 249 (+1 last 32d, -1 last 7d)
  Activity  🟡 Sep 2025
  License   MIT
  Tags      prompt-optimization · evolutionary-algorithms · research · genetic-algorithms
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/microsoft/PromptWizard">PromptWizard</a></i> <code>⭐ 4.0K</code> <code>MIT</code> Agent-driven self-evolving prompt optimization</summary>

<br>

*Task-aware agent-driven prompt optimization using self-evolving critique and synthesis (Microsoft). **DSPy and GEPA are the maintained optimizers.***

```
  Score     59/100
  Stars     ⭐ 4,004 (n/a)
  Activity  🔴 Aug 2025 - unmaintained 12+ months
  License   MIT
  Tags      prompt-engineering · prompt-optimization · microsoft
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/zou-group/textgrad">TextGrad</a></i> <code>⭐ 3.7K</code> <code>MIT</code> Gradient-like optimization of AI via text feedback</summary>

<br>

*Automatic differentiation via text feedback, enabling gradient-like optimization of compound AI systems (Nature 2024). **GEPA and DSPy carry this line of work forward.***

```
  Score     56/100
  Stars     ⭐ 3,703 (n/a)
  Activity  🔴 Jul 2025 - unmaintained 12+ months
  Release   📦 Dec 2024
  License   MIT
  Tags      large-language-models · prompt-optimization
```

</details>


**[⬆ Back to Contents](#contents)**

## Agent Frameworks

*Libraries and SDKs for building multi-agent systems, conversational agents, tool-using agents, and agentic workflows. Also includes agent infrastructure like memory, browser control, and sandboxes.*

<details><summary>🟢 🥇 <b><a href="https://github.com/NousResearch/hermes-agent">Hermes Agent</a></b> <code>⭐ 233.7K</code> <code>↗️ +16274</code> <code>MIT</code> Self-improving agent that learns skills from experience</summary>

<br>

Self-improving agent with a built-in learning loop - it creates skills from experience, searches its own past conversations, and builds a model of you across sessions. Runs anywhere from a $5 VPS to a GPU cluster (Nous Research).

```
  Score     94/100
  Stars     ⭐ 233,735 (+16274 last 32d, +3267 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agent-memory · ai-agent · assistant · skills
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/langchain-ai/langgraph">LangGraph</a></b> <code>⭐ 40.2K</code> <code>↗️ +2496</code> <code>MIT</code> Stateful graph runtime for agents</summary>

<br>

LangChain's graph-based runtime for building stateful, resilient agents with checkpointing, human-in-the-loop, and controllable multi-actor workflows.

```
  Score     87/100
  Stars     ⭐ 40,153 (+2496 last 32d, +479 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agents · openai · generative-ai · ai-agents · open-source
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/browser-use/browser-use">Browser Use</a></b> <code>⭐ 109.9K</code> <code>↗️ +4297</code> <code>MIT</code> LLM-driven browser automation framework</summary>

<br>

Playwright-powered agent harness that makes websites accessible to LLMs so they can navigate, fill forms, and automate tasks across real browsers.

```
  Score     86/100
  Stars     ⭐ 109,944 (+4297 last 32d, +747 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      ai-agents · browser-automation · browser-use
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/vectorize-io/hindsight">Hindsight</a></b> <code>⭐ 20.8K</code> <code>↗️ +2179</code> <code>MIT</code> Agent memory that learns, not just remembers</summary>

<br>

Agent memory engine built for learning rather than plain recall - backed by a published paper and SDKs for Python and TypeScript, positioning itself as the post-RAG approach to agent memory.

```
  Score     86/100
  Stars     ⭐ 20,780 (+2179 last 32d, +836 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agents · agent-memory · typescript · learning
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/bytedance/deer-flow">DeerFlow</a></b> <code>⭐ 80.5K</code> <code>↗️ +3031</code> <code>MIT</code> Super-agent harness with sub-agents and sandboxes</summary>

<br>

Open-source super-agent harness that orchestrates sub-agents, memory, and sandboxes through extensible skills - the 2.0 rewrite topped GitHub Trending in February 2026 (ByteDance).

```
  Score     85/100
  Stars     ⭐ 80,454 (+3031 last 32d, +454 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   MIT
  Tags      multi-agent · agent-memory · deep-research · sandbox · skills
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/thedotmack/claude-mem">claude-mem</a></b> <code>⭐ 91.4K</code> <code>↗️ +3479</code> <code>Apache-2.0</code> Persistent compressed memory across agent sessions</summary>

<br>

Persistent memory plugin for Claude Code - captures everything the agent does in a session, compresses it with AI, and injects the relevant context into future sessions.

```
  Score     85/100
  Stars     ⭐ 91,394 (+3479 last 32d, +668 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      developer-tools · ai-agents · agent-memory
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/mem0ai/mem0">Mem0</a></b> <code>⭐ 63.7K</code> <code>↗️ +2467</code> <code>Apache-2.0</code> Universal memory layer for agents</summary>

<br>

Universal memory layer that gives AI agents persistent, personalized long-term memory with extraction, retrieval, and graph-backed storage.

```
  Score     84/100
  Stars     ⭐ 63,743 (+2467 last 32d, +499 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agents · ai-agents · chatgpt · rag · genai
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/langchain-ai/langchain">LangChain</a></b> <code>⭐ 144.7K</code> <code>↗️ +2562</code> <code>MIT</code> The original LLM framework, evolved for agents</summary>

<br>

The framework that defined LLM application development, now an agent engineering platform with the largest integration ecosystem in the space. Pairs with LangGraph when you need production-grade control.

```
  Score     84/100
  Stars     ⭐ 144,704 (+2562 last 32d, +463 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agents · openai · framework · anthropic · orchestration
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/crewAIInc/crewAI">CrewAI</a></b> <code>⭐ 57.4K</code> <code>↗️ +1590</code> <code>MIT</code> Role-playing specialist agents for complex workflows</summary>

<br>

Multi-agent framework orchestrating role-playing specialist agents for complex AI workflows.

```
  Score     82/100
  Stars     ⭐ 57,413 (+1590 last 32d, +344 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agents · llms · ai-agents · aiagentframework
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/microsoft/agent-framework">Microsoft Agent Framework</a></b> <code>⭐ 13.0K</code> <code>↗️ +781</code> <code>MIT</code> Unified Semantic Kernel plus AutoGen successor</summary>

<br>

Unified 1.0 SDK (April 2026) that merges Semantic Kernel and AutoGen into a single production-ready framework for agents and multi-agent workflows (Microsoft).

```
  Score     82/100
  Stars     ⭐ 13,020 (+781 last 32d, +221 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agent · multi-agent · autogen
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/openclaw/openclaw">OpenClaw</a></b> <code>⭐ 387.0K</code> <code>↗️ +3461</code> <code>NOASSERTION</code> Self-hosted personal AI assistant on your channels</summary>

<br>

Self-hosted personal AI assistant that answers on 15+ channels you already use - WhatsApp, Telegram, Slack, Discord, iMessage - with voice on macOS/iOS/Android and a live Canvas. The fastest-growing open-source project of 2026.

```
  Score     82/100
  Stars     ⭐ 386,994 (+3461 last 32d, +711 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      agents · self-hosted · voice
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/langgenius/dify">Dify</a></b> <code>⭐ 153.1K</code> <code>↗️ +3665</code> <code>NOASSERTION</code> Visual platform for production agentic workflows</summary>

<br>

Production-ready platform for building agentic workflows visually, with built-in RAG pipelines, model management, and observability. The go-to self-hosted choice for shipping LLM apps without glue code.

```
  Score     81/100
  Stars     ⭐ 153,099 (+3665 last 32d, +668 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   NOASSERTION
  Tags      llmops · rag · self-hosted · orchestration · workflow
```

</details>

<details><summary>🟢 <b>13</b> <b><a href="https://github.com/Mintplex-Labs/anything-llm">AnythingLLM</a></b> <code>⭐ 65.0K</code> <code>↗️ +1412</code> <code>MIT</code> Local-first all-in-one agent and RAG workspace</summary>

<br>

All-in-one local-first AI workspace - chat with documents, run agents, and keep every byte on your own hardware, with desktop and Docker distributions and multi-user support.

```
  Score     81/100
  Stars     ⭐ 65,002 (+1412 last 32d, +296 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      ai-agents · rag · self-hosted · multimodal · privacy
```

</details>

<details><summary>🟢 <b>14</b> <b><a href="https://github.com/HKUDS/nanobot">nanobot</a></b> <code>⭐ 47.2K</code> <code>↗️ +1331</code> <code>MIT</code> Lightweight AI agent for tools and workflows</summary>

<br>

Lightweight open-source AI agent for your tools, chats, and workflows - pip-installable and refreshingly small compared to heavyweight agent platforms (HKU Data Science Lab).

```
  Score     81/100
  Stars     ⭐ 47,248 (+1331 last 32d, +266 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   MIT
  Tags      open-source · ai-agent · assistant · workflows
```

</details>

<details><summary>🟢 <b>15</b> <b><a href="https://github.com/pydantic/pydantic-ai">Pydantic AI</a></b> <code>⭐ 19.4K</code> <code>↗️ +761</code> <code>MIT</code> Typed agents the Pydantic way</summary>

<br>

Agent framework from the Pydantic team that brings typed validation, dependency injection, and structured outputs to LLM apps across providers.

```
  Score     80/100
  Stars     ⭐ 19,425 (+761 last 32d, +135 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      genai · agent-framework · pydantic
```

</details>

<details><summary>🟢 <b>16</b> <b><a href="https://github.com/openai/openai-agents-python">OpenAI Agents SDK</a></b> <code>⭐ 28.8K</code> <code>↗️ +792</code> <code>MIT</code> OpenAI's multi-agent and voice-agent SDK</summary>

<br>

Lightweight framework for multi-agent workflows with handoffs, guardrails, tracing, and voice-agent support across Python and JavaScript (OpenAI).

```
  Score     79/100
  Stars     ⭐ 28,821 (+792 last 32d, +183 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      openai · agent · ai-agents · multi-agent
```

</details>

<details><summary>🟢 <b>17</b> <b><a href="https://github.com/run-llama/llama_index">LlamaIndex</a></b> <code>⭐ 51.8K</code> <code>MIT</code> Document agents and retrieval over private data</summary>

<br>

Framework for building document agents over private data, covering ingestion, parsing, indexing, and retrieval for RAG and agentic workflows.

```
  Score     79/100
  Stars     ⭐ 51,787 (+153 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agents · rag · framework · data · llamaindex
```

</details>

<details><summary>🟢 <b>18</b> <b><a href="https://github.com/e2b-dev/E2B">E2B</a></b> <code>⭐ 13.5K</code> <code>↗️ +453</code> <code>Apache-2.0</code> Secure code sandboxes for agents</summary>

<br>

Open-source secure cloud sandboxes that give AI agents isolated Linux VMs to run generated code, browsers, and real-world developer tools.

```
  Score     78/100
  Stars     ⭐ 13,502 (+453 last 32d, +106 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      openai · agent · gpt · ai-agents · typescript
```

</details>

<details><summary>🟢 <b>19</b> <b><a href="https://github.com/Significant-Gravitas/AutoGPT">AutoGPT</a></b> <code>⭐ 186.7K</code> <code>↗️ +1080</code> <code>NOASSERTION</code> The original autonomous agent, now a platform</summary>

<br>

The project that ignited the autonomous-agent wave in 2023, now a full platform for building, deploying, and monitoring continuous agents with a visual workflow builder.

```
  Score     78/100
  Stars     ⭐ 186,699 (+1080 last 32d, +81 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      autonomous-agents · orchestration · no-code
```

</details>

<details><summary>🟢 <b>20</b> <b><a href="https://github.com/agno-agi/agno">Agno</a></b> <code>⭐ 41.8K</code> <code>↗️ +513</code> <code>Apache-2.0</code> Full-stack framework for building agent platforms</summary>

<br>

Full-stack framework (formerly Phidata) for building and operating agent platforms with memory, knowledge, and human-in-the-loop control, known for fast agent instantiation and a built-in UI.

```
  Score     78/100
  Stars     ⭐ 41,815 (+513 last 32d, +107 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agents · developer-tools · multi-agent · framework · agent-memory
```

</details>

<details><summary>🟢 <b>21</b> <b><a href="https://github.com/google/adk-python">Google ADK for Python</a></b> <code>⭐ 21.2K</code> <code>↗️ +442</code> <code>Apache-2.0</code> Google's production agent development kit</summary>

<br>

Google's code-first Python toolkit for building, evaluating, and deploying production AI agents with the same stack powering Gemini and Agentspace.

```
  Score     77/100
  Stars     ⭐ 21,213 (+442 last 32d, +104 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agents · llms · ai-agents · multi-agent · agentic-ai
```

</details>

<details><summary>🟢 <b>22</b> <b><a href="https://github.com/strands-agents/harness-sdk">Strands Agents</a></b> <code>⭐ 7.0K</code> <code>↗️ +319</code> <code>Apache-2.0</code> AWS model-driven agents SDK, 14M downloads</summary>

<br>

Model-driven SDK that builds agents in a few lines of code - 14M+ downloads, Python and TypeScript builds, deploys to Bedrock AgentCore, Lambda, Fargate, or Kubernetes (AWS).

```
  Score     77/100
  Stars     ⭐ 6,967 (+319 last 32d, +60 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agent · multi-agent · typescript · aws · bedrock
```

</details>

<details><summary>🟢 <b>23</b> <b><a href="https://github.com/letta-ai/letta">Letta</a></b> <code>⭐ 24.3K</code> <code>↗️ +453</code> <code>Apache-2.0</code> Stateful agents with editable long-term memory</summary>

<br>

Stateful agents framework from the team behind MemGPT - agents get editable long-term memory that persists across sessions, served via REST APIs with a visual development environment.

```
  Score     77/100
  Stars     ⭐ 24,327 (+453 last 32d, +88 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 May 2026
  License   Apache-2.0
  Tags      framework · agent-memory · rest-api
```

</details>

<details><summary>🟢 <b>24</b> <b><a href="https://github.com/deepset-ai/haystack">Haystack</a></b> <code>⭐ 26.3K</code> <code>Apache-2.0</code> Modular pipelines for production LLM apps</summary>

<br>

Orchestration framework for production LLM applications, composing retrieval, routing, memory, and generation into explicit modular pipelines.

```
  Score     76/100
  Stars     ⭐ 26,266 (+61 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      agents · mcp · rag · agentic-ai · framework
```

</details>

<details><summary>🟢 <b>25</b> <b><a href="https://github.com/Fosowl/agenticSeek">AgenticSeek</a></b> <code>⭐ 26.9K</code> <code>↗️ +295</code> <code>GPL-3.0</code> Fully local autonomous agent, no API bills</summary>

<br>

Fully local autonomous agent - a self-hosted Manus alternative that thinks, browses the web, and writes code with no API keys and no monthly bill.

```
  Score     75/100
  Stars     ⭐ 26,940 (+295 last 32d, +117 last 7d)
  Activity  🟢 Aug 2026
  License   GPL-3.0
  Tags      autonomous-agents · self-hosted · privacy · browser-automation · local-ai
```

</details>

<details><summary>🟢 <b>26</b> <b><a href="https://github.com/mastra-ai/mastra">Mastra</a></b> <code>⭐ 27.3K</code> <code>NOASSERTION</code> TypeScript agent framework with typed workflows</summary>

<br>

TypeScript framework for AI agents with typed workflows, tool calling, memory, and evaluations, deployable to standard Node and edge runtimes.

```
  Score     75/100
  Stars     ⭐ 27,348 (+155 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      agents · mcp · typescript · evals · javascript
```

</details>

<details><summary>🟢 <b>27</b> <b><a href="https://github.com/huggingface/smolagents">smolagents</a></b> <code>⭐ 28.9K</code> <code>↗️ +473</code> <code>Apache-2.0</code> Barebones code-writing agents library</summary>

<br>

Hugging Face's minimalist agent library where agents reason by writing and executing Python code rather than emitting JSON tool calls.

```
  Score     74/100
  Stars     ⭐ 28,914 (+473 last 32d, +112 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 May 2026
  License   Apache-2.0
  Tags      agents · huggingface
```

</details>

<details><summary>🟢 <b>28</b> <b><a href="https://github.com/ag2ai/ag2">AG2</a></b> <code>⭐ 4.9K</code> <code>↗️ +100</code> <code>Apache-2.0</code> Multi-agent AgentOS from AutoGen lineage</summary>

<br>

Open-source AgentOS (formerly AutoGen) for building multi-agent systems with conversation patterns, tool use, and code execution across LLM providers.

```
  Score     72/100
  Stars     ⭐ 4,882 (+100 last 32d, +24 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llms · open-source · multi-agent · mcp · agentic-ai
```

</details>

<details><summary>🟢 <b>29</b> <b><a href="https://github.com/microsoft/magentic-ui">Magentic-UI</a></b> <code>⭐ 10.1K</code> <code>↗️ +105</code> <code>MIT</code> Human-in-the-loop web agent prototype</summary>

<br>

Microsoft Research prototype for a human-centered web agent with co-planning, action previews, and transparent browser control built on AutoGen.

```
  Score     70/100
  Stars     ⭐ 10,069 (+105 last 32d, +6 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 May 2026
  License   MIT
  Tags      agents · autogen · browser-use · ui
```

</details>

<details><summary>🟢 <b>30</b> <b><a href="https://github.com/daytonaio/daytona">Daytona</a></b> <code>⭐ 71.9K</code> <code>↘️ -307</code> Elastic secure sandboxes for AI-generated code</summary>

<br>

Secure and elastic infrastructure for running AI-generated code in isolated sandboxes with near-instant cold starts - the self-hostable counterpart to E2B for agent code execution.

```
  Score     65/100
  Stars     ⭐ 71,936 (-307 last 32d, -85 last 7d)
  Activity  🟢 Jun 2026
  Release   📦 Jun 2026
  License   -
  Tags      developer-tools · self-hosted · sandbox
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/FlowiseAI/Flowise">Flowise</a></i> <code>⭐ 55.4K</code> <code>NOASSERTION</code> Build AI agents visually, deploy as APIs</summary>

<br>

*Visual drag-and-drop builder for AI agents and LLM workflows - wire up chains, tools, and memory in the browser and deploy as APIs without writing orchestration code. **Archived. Project wound down; repository archived upstream.***

```
  Score     0/100
  Stars     ⭐ 55,383 (n/a)
  Activity  🔴 Aug 2026 - archived
  Release   📦 Jul 2026
  License   NOASSERTION
  Tags      agents · workflow · javascript · low-code · chatbot
```

</details>


**[⬆ Back to Contents](#contents)**

## Coding Agents

*Ready-to-use AI agents that autonomously write, debug, refactor, and review software code.*

<details><summary>🟢 🥇 <b><a href="https://github.com/anomalyco/opencode">OpenCode</a></b> <code>⭐ 199.7K</code> <code>↗️ +12070</code> <code>MIT</code> Terminal-native, model-agnostic coding agent</summary>

<br>

Terminal-native AI coding agent that is model-agnostic and scriptable for headless workflows, breakout 2026 OSS entry.

```
  Score     92/100
  Stars     ⭐ 199,717 (+12070 last 32d, +2322 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agent · cli · coding-agent · terminal
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/openai/codex">Codex</a></b> <code>⭐ 110.1K</code> <code>Apache-2.0</code> Terminal coding agent from OpenAI</summary>

<br>

OpenAI's terminal coding agent that reads, edits, and runs code in a local sandbox, with the same agent available in the IDE and on the web.

```
  Score     92/100
  Stars     ⭐ 110,053 (+4122 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      openai · agent · cli · coding-agent · terminal
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/OpenHands/OpenHands">OpenHands</a></b> <code>⭐ 84.7K</code> <code>↗️ +3310</code> <code>MIT</code> AI dev platform, 53-72% SWE-Bench resolve rate</summary>

<br>

AI software development platform achieving 53-72% resolve rate on SWE-Bench Verified.

```
  Score     85/100
  Stars     ⭐ 84,675 (+3310 last 32d, +661 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      openai · agent · developer-tools · gpt · artificial-intelligence
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/aaif-goose/goose">Goose</a></b> <code>⭐ 53.1K</code> <code>↗️ +1816</code> <code>Apache-2.0</code> Local MCP-based engineering agent</summary>

<br>

Local, extensible AI agent that handles complex engineering tasks end-to-end via the Model Context Protocol.

```
  Score     83/100
  Stars     ⭐ 53,131 (+1816 last 32d, +337 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agent · mcp
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/SWE-agent/mini-swe-agent">mini-swe-agent</a></b> <code>⭐ 6.7K</code> <code>↗️ +753</code> <code>MIT</code> 100-line agent with 74% SWE-bench score</summary>

<br>

Minimalist 100-line coding agent achieving 74% on SWE-bench Verified as a learning reference.

```
  Score     82/100
  Stars     ⭐ 6,655 (+753 last 32d, +154 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   MIT
  Tags      agent · ai-agent
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/cline/cline">Cline</a></b> <code>⭐ 66.6K</code> <code>↗️ +1757</code> <code>Apache-2.0</code> Approval-gated autonomous agent inside VS Code</summary>

<br>

Autonomous VS Code extension with Plan and Act modes where every file edit, terminal command, and browser action requires explicit approval.

```
  Score     82/100
  Stars     ⭐ 66,580 (+1757 last 32d, +410 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agent · developer-tools · autonomous-agents · coding-agent · vscode-extension
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/QwenLM/qwen-code">Qwen Code</a></b> <code>⭐ 27.2K</code> <code>Apache-2.0</code> Terminal coding agent tuned for Qwen3-Coder</summary>

<br>

Terminal coding agent from the Qwen team, adapted for Qwen3-Coder models with parser and tool support tuned for agentic workflows.

```
  Score     81/100
  Stars     ⭐ 27,239 (+243 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      developer-tools · cli · mcp · coding-agent · qwen
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/google-gemini/gemini-cli">Gemini CLI</a></b> <code>⭐ 106.6K</code> <code>↗️ +515</code> <code>Apache-2.0</code> Google's open-source agentic terminal for Gemini</summary>

<br>

Open-source agentic CLI bringing Gemini models and ReAct-style tool use directly to the terminal (Google).

```
  Score     80/100
  Stars     ⭐ 106,594 (+515 last 32d, +83 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agent · cli · terminal · google · gemini
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/anthropics/claude-code">Claude Code</a></b> <code>⭐ 142.2K</code> <code>↗️ +3824</code> Anthropic's 80.8% SWE-bench terminal coding agent</summary>

<br>

Terminal-native coding agent that hits ~80.8% on SWE-bench Verified with Opus 4.6 and ships as CLI plus IDE extensions (Anthropic).

```
  Score     77/100
  Stars     ⭐ 142,214 (+3824 last 32d, +781 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   -
  Tags      agent · cli · coding-agent · anthropic · terminal
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/Kilo-Org/kilocode">Kilo Code</a></b> <code>⭐ 27.0K</code> <code>MIT</code> Agentic coding for VS Code and JetBrains</summary>

<br>

Agentic coding platform for VS Code and JetBrains that plans, edits across files, and runs commands, with model choice spanning several providers.

```
  Score     77/100
  Stars     ⭐ 26,961 (+93 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      cli · ai-coding · jetbrains · vscode
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/continuedev/continue">Continue</a></b> <code>⭐ 35.6K</code> <code>↗️ +588</code> <code>Apache-2.0</code> Open-source IDE assistant with CI-enforceable AI checks</summary>

<br>

Open-source IDE assistant and CLI that supports source-controlled AI checks enforceable in CI, across VS Code, JetBrains, and terminal.

```
  Score     76/100
  Stars     ⭐ 35,569 (+588 last 32d, +90 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Jun 2026
  License   Apache-2.0
  Tags      developer-tools · open-source · chatgpt · copilot · jetbrains
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/charmbracelet/crush">Crush</a></b> <code>⭐ 27.5K</code> <code>↗️ +887</code> <code>NOASSERTION</code> Glamorous terminal coding agent from Charm</summary>

<br>

Terminal-native coding agent with the signature glamorous TUI - model-agnostic, with LSP integration and MCP support, from the makers of Bubble Tea (Charm).

```
  Score     76/100
  Stars     ⭐ 27,546 (+887 last 32d, +176 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      cli · mcp · agentic-ai · coding-agent · terminal
```

</details>

<details><summary>🟡 <b>13</b> <b><a href="https://github.com/Aider-AI/aider">Aider</a></b> <code>⭐ 48.4K</code> <code>↗️ +841</code> <code>Apache-2.0</code> AI pair programmer editing your local repository</summary>

<br>

AI pair programmer in the terminal that edits code directly in your local repository. **Quiet - minimal recent development.**

```
  Score     74/100
  Stars     ⭐ 48,372 (+841 last 32d, +176 last 7d)
  Activity  🟡 May 2026
  Release   📦 Aug 2025
  License   Apache-2.0
  Tags      openai · llama · chatgpt · cli · anthropic
```

</details>

<details><summary>🟢 <b>14</b> <b><a href="https://github.com/SWE-agent/SWE-agent">SWE-agent</a></b> <code>⭐ 20.1K</code> <code>↗️ +229</code> <code>MIT</code> Autonomous agent solving real GitHub issues</summary>

<br>

Autonomous agent that solves real GitHub issues by reading, editing, and testing code (NeurIPS 2024).

```
  Score     73/100
  Stars     ⭐ 20,094 (+229 last 32d, +38 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 May 2025
  License   MIT
  Tags      agent · developer-tools
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/AutoCodeRoverSG/auto-code-rover">AutoCodeRover</a></i> <code>⭐ 3.1K</code> <code>NOASSERTION</code> Structure-aware autonomous code repair and patching</summary>

<br>

*Structure-aware autonomous program repair combining code search with LLM-based patching. **SWE-agent and OpenHands are the maintained alternatives.***

```
  Score     49/100
  Stars     ⭐ 3,098 (n/a)
  Activity  🔴 Apr 2025 - unmaintained 12+ months
  Release   📦 Sep 2024
  License   NOASSERTION
  Tags      agents · autonomous-agents
```

</details>

---

<details><summary>🏢 <b><a href="https://cursor.com">Cursor</a></b> Market-defining AI-native VS Code fork</summary>

<br>

VS Code fork built around deeply integrated AI chat, autocomplete, and multi-file editing - the market-defining commercial IDE for agentic coding (Anysphere).

```
  Vendor    Anysphere
  Pricing   freemium
```

</details>

<details><summary>🏢 <b><a href="https://devin.ai/desktop">Devin Desktop</a></b> Agentic IDE from Cognition, formerly Windsurf</summary>

<br>

Agentic IDE from Cognition, the continuation of Windsurf, pairing an editor with a background coding agent.

```
  Vendor    Cognition
  Pricing   freemium
```

</details>

<details><summary>🏢 <b><a href="https://devin.ai">Devin</a></b> End-to-end autonomous software engineer</summary>

<br>

Autonomous software engineer that plans, codes, tests, and deploys end-to-end, running in a cloud sandbox with browser and shell access (Cognition).

```
  Vendor    Cognition
  Pricing   subscription
```

</details>


**[⬆ Back to Contents](#contents)**

## ML and Research Agents

*Ready-to-use agents that autonomously run ML experiments, design studies, or conduct scientific research end-to-end.*

<details><summary>🟢 🥇 <b><a href="https://github.com/algorithmicsuperintelligence/openevolve">OpenEvolve</a></b> <code>⭐ 7.2K</code> <code>Apache-2.0</code> LLM-guided evolutionary program search</summary>

<br>

Open implementation of AlphaEvolve that evolves whole programs with an LLM-guided evolutionary loop against a user-supplied evaluator.

```
  Score     80/100
  Stars     ⭐ 7,243 (+244 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      coding-agent · evolutionary-algorithms · genetic-algorithms
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/assafelovic/gpt-researcher">GPT Researcher</a></b> <code>⭐ 29.1K</code> <code>↗️ +588</code> <code>Apache-2.0</code> Autonomous deep-research report agent</summary>

<br>

Autonomous research agent that plans queries, scrapes sources, and writes cited multi-page reports using any LLM with optional MCP server mode.

```
  Score     76/100
  Stars     ⭐ 29,060 (+588 last 32d, +88 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      agent · llms · mcp · research · automation
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/microsoft/RD-Agent">R&D-Agent</a></b> <code>⭐ 14.3K</code> <code>↗️ +347</code> <code>MIT</code> Microsoft multi-agent R&D loop for data-driven AI</summary>

<br>

Multi-agent framework automating the full R&D loop for data-driven AI (hypothesis, implementation, evaluation, iteration); top-performing MLE-Bench agent at 35.1% any-medal rate on its chosen components (Microsoft, ICLR 2026 submission).

```
  Score     75/100
  Stars     ⭐ 14,299 (+347 last 32d, +73 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Nov 2025
  License   MIT
  Tags      agents · multi-agent · mle-bench · llm-agents
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/Future-House/paper-qa">PaperQA</a></b> <code>⭐ 9.1K</code> <code>↗️ +168</code> <code>Apache-2.0</code> High-accuracy RAG over scientific literature</summary>

<br>

High-accuracy retrieval-augmented generation for answering questions from scientific literature.

```
  Score     73/100
  Stars     ⭐ 9,066 (+168 last 32d, +36 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      rag · search
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/WecoAI/aideml">AIDE</a></b> <code>⭐ 1.5K</code> <code>↗️ +61</code> <code>MIT</code> ML agent beating 50% of human Kaggle competitors</summary>

<br>

ML engineering agent using tree search over solution space - exceeds 50% of human Kaggle competitors; top agents using AIDE achieve medals in 64%+ of MLE-Bench competitions (Weco AI).

```
  Score     71/100
  Stars     ⭐ 1,485 (+61 last 32d, +8 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Nov 2025
  License   MIT
  Tags      automated-machine-learning · ai-agents · autonomous-agents
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/aibuildai/AI-Build-AI">AIBuildAI</a></b> <code>⭐ 343</code> <code>↗️ +32</code> <code>MIT</code> SOTA on MLE-Bench (63.1% medal rate, March 2026)</summary>

<br>

Hierarchical agent system for autonomous AI model development; ranked

```
  Score     70/100
  Stars     ⭐ 343 (+32 last 32d, +4 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      agents · autonomous-agents · multi-agent · mle-bench
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/SakanaAI/ShinkaEvolve">ShinkaEvolve</a></b> <code>⭐ 1.4K</code> <code>Apache-2.0</code> Sample-efficient LLM program evolution</summary>

<br>

Sample-efficient program evolution framework from Sakana AI, reaching competitive solutions in far fewer evaluations than prior evolutionary search.

```
  Score     70/100
  Stars     ⭐ 1,350 (+12 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   Apache-2.0
  Tags      evolutionary-algorithms
```

</details>

<details><summary>🟡 <b>8</b> <b><a href="https://github.com/karpathy/autoresearch">AutoResearch</a></b> <code>⭐ 94.3K</code> <code>↗️ +2732</code> Agents run 100 ML experiments overnight autonomously</summary>

<br>

Minimal script enabling AI agents to autonomously run ~100 ML experiments overnight at ~12/hour, finding genuine improvements that transfer to larger models (Karpathy, March 2026). **Quiet - minimal recent development.**

```
  Score     68/100
  Stars     ⭐ 94,331 (+2732 last 32d, +494 last 7d)
  Activity  🟡 Mar 2026
  License   -
  Tags      agents · autonomous-agents · research · automated-research
```

</details>

<details><summary>🟡 <b>9</b> <b><a href="https://github.com/stanford-oval/storm">STORM</a></b> <code>⭐ 31.1K</code> <code>↗️ +936</code> <code>MIT</code> LLM researches topics and writes full articles</summary>

<br>

LLM-powered knowledge curation that researches topics and generates full articles with citations (Stanford). **Quiet - no commits for 6+ months.**

```
  Score     68/100
  Stars     ⭐ 31,088 (+936 last 32d, +100 last 7d)
  Activity  🟡 Sep 2025
  Release   📦 Jan 2025
  License   MIT
  Tags      large-language-models · nlp · deep-research · retrieval-augmented-generation · agentic-rag
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/ruc-datalab/DeepAnalyze">DeepAnalyze</a></b> <code>⭐ 4.5K</code> <code>MIT</code> Agentic LLM for autonomous data science</summary>

<br>

Agentic LLM for autonomous data science that plans analyses, writes and runs code, and produces a full analysis report from a raw dataset.

```
  Score     68/100
  Stars     ⭐ 4,547 (+24 last 7d)
  Activity  🟢 Jul 2026
  License   MIT
  Tags      agent · data-analysis · deep-research · jupyter
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/InternScience/MLEvolve">MLEvolve</a></b> <code>⭐ 422</code> <code>↗️ +26</code> <code>Apache-2.0</code> Progressive search + experience memory for ML agents</summary>

<br>

End-to-end ML algorithm design and optimization via progressive search and experience-driven memory; tracked on the MLE-Bench leaderboard alongside AIDE and R&D-Agent.

```
  Score     67/100
  Stars     ⭐ 422 (+26 last 32d, +5 last 7d)
  Activity  🟢 Jul 2026
  License   Apache-2.0
  Tags      agents · mle-bench · evolutionary-search
```

</details>

<details><summary>🟡 <b>12</b> <b><a href="https://github.com/SakanaAI/AI-Scientist">AI-Scientist</a></b> <code>⭐ 14.4K</code> <code>↗️ +175</code> <code>NOASSERTION</code> Fully automated discovery from idea to paper</summary>

<br>

Fully automated open-ended scientific discovery from idea generation to experiment execution to paper writing (Sakana AI). **Quiet - no commits for 6+ months.**

```
  Score     59/100
  Stars     ⭐ 14,428 (+175 last 32d, +37 last 7d)
  Activity  🟡 Dec 2025
  License   NOASSERTION
  Tags      agents · autonomous-agents · research · automated-research · scientific-discovery
```

</details>

<details><summary>🟡 <b>13</b> <b><a href="https://github.com/SakanaAI/AI-Scientist-v2">AI-Scientist-v2</a></b> <code>⭐ 7.0K</code> <code>↗️ +155</code> <code>NOASSERTION</code> First AI paper accepted at peer-reviewed workshop</summary>

<br>

Second generation using agentic tree search, producing the first AI-generated paper accepted at a peer-reviewed workshop. **Quiet - no commits for 6+ months.**

```
  Score     58/100
  Stars     ⭐ 7,033 (+155 last 32d, +29 last 7d)
  Activity  🟡 Dec 2025
  License   NOASSERTION
  Tags      agents · autonomous-agents · automated-research · scientific-discovery
```

</details>

<details><summary>🟢 <b>14</b> <b><a href="https://github.com/autogluon/autogluon-assistant">AutoGluon Assistant</a></b> <code>⭐ 297</code> <code>Apache-2.0</code> Multi-agent end-to-end multimodal ML automation</summary>

<br>

Multi-agent system that turns a raw multimodal dataset and a plain-language objective into a trained AutoGluon pipeline end to end (MLZero).

```
  Score     58/100
  Stars     ⭐ 297 (0 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      multi-agent · multimodal
```

</details>

<details><summary>🟡 <b>15</b> <b><a href="https://github.com/HKUDS/AI-Researcher">AI-Researcher</a></b> <code>⭐ 5.7K</code> <code>↗️ +91</code> Full research lifecycle from literature to experiments</summary>

<br>

Autonomous agent automating the full research lifecycle from literature review to experimentation (NeurIPS 2025 Spotlight). **Quiet - no commits for 6+ months.**

```
  Score     51/100
  Stars     ⭐ 5,690 (+91 last 32d, +16 last 7d)
  Activity  🟡 Oct 2025
  License   -
  Tags      ai-researcher
```

</details>

<details><summary>🟡 <b>16</b> <b><a href="https://github.com/FractalAIResearchLabs/PiEvolve">PiEvolve</a></b> <code>⭐ 24</code> <code>MIT</code> Rank-1 on OpenAI MLE-Bench via evolutionary search</summary>

<br>

Evolutionary agent for long-horizon tasks; achieved Rank-1 overall on the OpenAI MLE-Bench leaderboard with compute-efficient variant ranked 4th at ~50% budget (Fractal AI Research). **Quiet - no commits for 6+ months.**

```
  Score     39/100
  Stars     ⭐ 24 (0 last 32d, 0 last 7d)
  Activity  🟡 Jan 2026
  License   MIT
  Tags      agents · autonomous-agents · mle-bench · evolutionary-search
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/DeepAuto-AI/automl-agent">AutoML-Agent</a></i> <code>⭐ 160</code> LLM agents for end-to-end AutoML pipelines</summary>

<br>

*Multi-agent LLM framework for full-pipeline AutoML from data retrieval through model deployment (ICML 2025). **Research prototype behind the AutoML-Agent paper.***

```
  Score     47/100
  Stars     ⭐ 160 (n/a)
  Activity  🔴 Jul 2025 - unmaintained 12+ months
  License   -
  Tags      llm-agents · multi-agent-systems
```

</details>


**[⬆ Back to Contents](#contents)**

## LLM Evaluation and Testing

*Frameworks for automated evaluation, testing, benchmarking, and red-teaming of language models, RAG pipelines, and agentic systems.*

<details><summary>🟢 🥇 <b><a href="https://github.com/promptfoo/promptfoo">Promptfoo</a></b> <code>⭐ 24.4K</code> <code>↗️ +993</code> <code>MIT</code> Test and red-team LLMs with CI/CD integration</summary>

<br>

Test and red-team LLM applications with automated evaluations, CI/CD integration, and vulnerability scanning.

```
  Score     81/100
  Stars     ⭐ 24,424 (+993 last 32d, +193 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      llmops · evaluation · llm-evaluation · prompt-engineering · rag
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/confident-ai/deepeval">DeepEval</a></b> <code>⭐ 17.8K</code> <code>↗️ +794</code> <code>Apache-2.0</code> Pytest-style LLM evaluation with 14+ metrics</summary>

<br>

Pytest-like framework with 14+ evaluation metrics for RAG, fine-tuning, and alignment assessment.

```
  Score     81/100
  Stars     ⭐ 17,754 (+794 last 32d, +160 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llm-evaluation · evaluation-framework · evaluation-metrics
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/UKGovernmentBEIS/inspect_ai">Inspect AI</a></b> <code>⭐ 2.6K</code> <code>↗️ +218</code> <code>MIT</code> Reproducible sandboxed LLM evals, 100+ prebuilt</summary>

<br>

Framework for reproducible LLM evals with sandboxed agent execution, 100+ prebuilt evaluations, and VS Code integration (UK AI Safety Institute).

```
  Score     78/100
  Stars     ⭐ 2,596 (+218 last 32d, +51 last 7d)
  Activity  🟢 Aug 2026
  License   MIT
  Tags      evaluation · llm-evaluation · framework · benchmarking
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/EleutherAI/lm-evaluation-harness">lm-evaluation-harness</a></b> <code>⭐ 13.7K</code> <code>↗️ +394</code> <code>MIT</code> Standard few-shot LLM evaluation across hundreds of benchmarks</summary>

<br>

Standard framework for few-shot evaluation of language models across hundreds of benchmarks (EleutherAI).

```
  Score     77/100
  Stars     ⭐ 13,733 (+394 last 32d, +103 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 May 2026
  License   MIT
  Tags      transformer · evaluation-framework · language-model
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/open-compass/opencompass">OpenCompass</a></b> <code>⭐ 7.3K</code> <code>↗️ +111</code> <code>Apache-2.0</code> One-stop evaluation for 100+ LLMs and benchmarks</summary>

<br>

One-stop evaluation platform supporting 100+ models across academic and real-world benchmarks.

```
  Score     72/100
  Stars     ⭐ 7,323 (+111 last 32d, +22 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   Apache-2.0
  Tags      openai · evaluation · chatgpt · benchmark · llama3
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/langwatch/langwatch">LangWatch</a></b> <code>⭐ 3.5K</code> <code>↗️ +101</code> <code>Apache-2.0</code> LLM evaluation platform with automated quality guardrails</summary>

<br>

Evaluation and testing platform for LLM applications and AI agents with automated quality guardrails.

```
  Score     72/100
  Stars     ⭐ 3,503 (+101 last 32d, +13 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llmops · openai · evaluation · prompt-engineering · gpt
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/Agenta-AI/agenta">Agenta</a></b> <code>⭐ 4.5K</code> <code>↗️ +192</code> <code>NOASSERTION</code> LLMOps platform with playground and evaluation</summary>

<br>

Open-source LLMOps platform combining prompt playground, evaluation workflows, and production observability.

```
  Score     71/100
  Stars     ⭐ 4,505 (+192 last 32d, +32 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      agents · llmops · evaluation · llm-evaluation · prompt-engineering
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/coze-dev/coze-loop">Coze Loop</a></b> <code>⭐ 5.7K</code> <code>↗️ +83</code> <code>Apache-2.0</code> Full-lifecycle agent evaluation and optimization</summary>

<br>

Full-lifecycle agent optimization platform covering prompt development, evaluation, and observability with tracing for agent applications (ByteDance Coze team).

```
  Score     71/100
  Stars     ⭐ 5,700 (+83 last 32d, +4 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jan 2026
  License   Apache-2.0
  Tags      llmops · evaluation · prompt-engineering · agent-evaluation
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/truera/trulens">TruLens</a></b> <code>⭐ 3.5K</code> <code>↗️ +69</code> <code>MIT</code> OpenTelemetry tracing and evaluation for RAG agents</summary>

<br>

OpenTelemetry-based tracing and evaluation for RAG and agent workflows with built-in feedback functions (Snowflake/TruEra).

```
  Score     70/100
  Stars     ⭐ 3,517 (+69 last 32d, +9 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      llmops · llms · llm-evaluation · ai-agents · neural-networks
```

</details>

<details><summary>🟡 <b>10</b> <b><a href="https://github.com/vibrantlabsai/ragas">RAGAS</a></b> <code>⭐ 15.4K</code> <code>↗️ +491</code> <code>Apache-2.0</code> Evaluate RAG retrieval and generation quality</summary>

<br>

Evaluation framework for RAG quality assessment measuring both retrieval and generation with LLM-based and traditional metrics. **Quiet - minimal recent development.**

```
  Score     69/100
  Stars     ⭐ 15,407 (+491 last 32d, +97 last 7d)
  Activity  🟡 Feb 2026
  Release   📦 Jan 2026
  License   Apache-2.0
  Tags      llmops · evaluation
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/Marker-Inc-Korea/AutoRAG">AutoRAG</a></b> <code>⭐ 5.1K</code> <code>↗️ +120</code> <code>NOASSERTION</code> AutoML-style search for optimal RAG pipelines</summary>

<br>

AutoML-style framework for RAG optimization that automatically finds the best retrieval, generation, and prompt pipeline configuration.

```
  Score     68/100
  Stars     ⭐ 5,051 (+120 last 32d, +18 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   NOASSERTION
  Tags      evaluation · llm-evaluation · open-source · optimization · rag
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/huggingface/lighteval">LightEval</a></b> <code>⭐ 2.5K</code> <code>↗️ +36</code> <code>MIT</code> Powers the Open LLM Leaderboard, 1000+ tasks</summary>

<br>

All-in-one LLM evaluation toolkit powering the Open LLM Leaderboard, supporting 1000+ tasks across multiple backends (Hugging Face).

```
  Score     68/100
  Stars     ⭐ 2,522 (+36 last 32d, +5 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Nov 2025
  License   MIT
  Tags      evaluation · huggingface
```

</details>

<details><summary>🟡 <b>13</b> <b><a href="https://github.com/openai/evals">OpenAI Evals</a></b> <code>⭐ 19.2K</code> <code>↗️ +263</code> <code>NOASSERTION</code> OpenAI's reference LLM eval framework and benchmark registry</summary>

<br>

Reference framework and open registry of LLM benchmarks from OpenAI - the original eval harness many downstream frameworks build on. **No stable release for 24+ months.**

```
  Score     64/100
  Stars     ⭐ 19,213 (+263 last 32d, +47 last 7d)
  Activity  🟡 Apr 2026
  License   NOASSERTION
  Tags      openai · evaluation · llm-evaluation · gpt · benchmark
```

</details>

<details><summary>🟡 <b>14</b> <b><a href="https://github.com/ShishirPatil/gorilla">Gorilla</a></b> <code>⭐ 13.0K</code> <code>↗️ +43</code> <code>Apache-2.0</code> Function-calling models and BFCL leaderboard</summary>

<br>

UC Berkeley project training and evaluating LLMs for function and tool calling, home of the Berkeley Function-Calling Leaderboard (BFCL). **Quiet - minimal recent development.**

```
  Score     64/100
  Stars     ⭐ 12,997 (+43 last 32d, +3 last 7d)
  Activity  🟡 Mar 2026
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      chatgpt · api
```

</details>


**[⬆ Back to Contents](#contents)**

## LLM Gateways and Routers

*Gateways and routers that proxy, load-balance, cache, and intelligently select between LLM providers - unifying model access, controlling cost, and improving reliability.*

<details><summary>🟢 🥇 <b><a href="https://github.com/BerriAI/litellm">LiteLLM</a></b> <code>⭐ 56.9K</code> <code>↗️ +2827</code> <code>NOASSERTION</code> Unified API gateway for 100+ LLMs</summary>

<br>

Unified API gateway for 100+ LLMs with load balancing, cost tracking, and automatic fallback routing.

```
  Score     82/100
  Stars     ⭐ 56,905 (+2827 last 32d, +576 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      llmops · openai · langchain · anthropic · gateway
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/maximhq/bifrost">Bifrost</a></b> <code>⭐ 7.5K</code> <code>↗️ +854</code> <code>Apache-2.0</code> Enterprise AI gateway with <100µs overhead at 5K RPS</summary>

<br>

High-performance enterprise AI gateway with adaptive load balancing, cluster mode, guardrails, and 1000+ model support; claims 50x lower latency than LiteLLM at under 100µs overhead at 5K RPS (Maxim AI).

```
  Score     82/100
  Stars     ⭐ 7,473 (+854 last 32d, +162 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      gateway · ai-gateway · llm-gateway · guardrails · rust
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/ulab-uiuc/LLMRouter">LLMRouter</a></b> <code>⭐ 2.4K</code> <code>↗️ +269</code> <code>MIT</code> 16+ LLM router implementations with unified evaluation</summary>

<br>

Unified library with 16+ router implementations and standardized evaluation via command-line interface.

```
  Score     78/100
  Stars     ⭐ 2,403 (+269 last 32d, +57 last 7d)
  Activity  🟢 Aug 2026
  License   MIT
  Tags      inference · research · model-selection · llm-routing
```

</details>

<details><summary>🟡 <b>4</b> <b><a href="https://github.com/Portkey-AI/gateway">Portkey Gateway</a></b> <code>⭐ 12.8K</code> <code>↗️ +305</code> <code>MIT</code> AI gateway routing and caching across 200+ LLMs</summary>

<br>

AI gateway for intelligent routing, caching, load balancing, and fallbacks across 200+ LLMs. **Quiet - minimal recent development.**

```
  Score     70/100
  Stars     ⭐ 12,780 (+305 last 32d, +64 last 7d)
  Activity  🟡 May 2026
  Release   📦 Jan 2026
  License   MIT
  Tags      llmops · openai · llms · generative-ai · hacktoberfest
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/braintrustdata/braintrust-proxy">Braintrust Proxy</a></b> <code>⭐ 408</code> <code>MIT</code> OpenAI-compatible proxy normalizing across providers</summary>

<br>

OpenAI-compatible proxy that normalizes requests across providers (OpenAI, Anthropic, Google, open models) with streaming, caching, and observability hooks.

```
  Score     60/100
  Stars     ⭐ 408 (+2 last 32d, 0 last 7d)
  Activity  🟢 Aug 2026
  License   MIT
  Tags      gateway · proxy
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/lm-sys/RouteLLM">RouteLLM</a></i> <code>⭐ 5.4K</code> <code>Apache-2.0</code> LLM routers cutting costs 85% without quality loss</summary>

<br>

*Framework for training and serving LLM routers that reduce costs by up to 85% without quality loss (LMSYS). **LiteLLM and LLMRouter cover routing for new work.***

```
  Score     59/100
  Stars     ⭐ 5,377 (n/a)
  Activity  🔴 Aug 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      inference · llm-routing · serving · cost-optimization
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/tensorzero/tensorzero">TensorZero</a></i> <code>⭐ 11.7K</code> <code>Apache-2.0</code> LLMOps platform with gateway, evals, and A/B testing</summary>

<br>

*Open-source LLMOps platform unifying an LLM gateway, observability, evaluation, optimization, and experimentation with A/B testing across models. **Archived. Project wound down; repository archived upstream.***

```
  Score     0/100
  Stars     ⭐ 11,721 (n/a)
  Activity  🔴 Jun 2026 - archived
  Release   📦 Jun 2026
  License   Apache-2.0
  Tags      llmops · mlops · openai · llms · generative-ai
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Monitoring and Observability

*Automated drift detection, performance monitoring, and quality observability for models deployed in production.*

<details><summary>🟢 🥇 <b><a href="https://github.com/Giskard-AI/giskard-oss">Giskard</a></b> <code>⭐ 5.8K</code> <code>↗️ +101</code> <code>Apache-2.0</code> ML and LLM testing for bias and security vulnerabilities</summary>

<br>

Testing and evaluation for ML and LLM models covering bias, performance regression, and security vulnerabilities.

```
  Score     72/100
  Stars     ⭐ 5,760 (+101 last 32d, +11 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llmops · mlops · llm-evaluation · llm-security · agent-evaluation
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/Helicone/helicone">Helicone</a></b> <code>⭐ 6.1K</code> <code>↗️ +122</code> <code>Apache-2.0</code> One-line LLM observability for cost and latency tracking</summary>

<br>

LLM observability platform with one-line integration for cost tracking, latency analysis, prompt versioning, and usage dashboards (YC W23).

```
  Score     72/100
  Stars     ⭐ 6,092 (+122 last 32d, +24 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2025
  License   Apache-2.0
  Tags      llmops · openai · evaluation · large-language-models · llm-evaluation
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/traceloop/openllmetry">OpenLLMetry</a></b> <code>⭐ 7.4K</code> <code>↗️ +75</code> <code>Apache-2.0</code> OpenTelemetry observability with auto-instrumentation for LLMs</summary>

<br>

OpenTelemetry-based observability for LLM applications with automatic instrumentation for LangChain, LlamaIndex, and OpenAI SDK.

```
  Score     71/100
  Stars     ⭐ 7,387 (+75 last 32d, +10 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llmops · generative-ai · ml · open-source · observability
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/evidentlyai/evidently">Evidently</a></b> <code>⭐ 7.8K</code> <code>↗️ +117</code> <code>Apache-2.0</code> ML and LLM observability with 100+ production metrics</summary>

<br>

ML and LLM observability with 100+ metrics for evaluating, testing, and monitoring any AI system in production.

```
  Score     66/100
  Stars     ⭐ 7,828 (+117 last 32d, +20 last 7d)
  Activity  🟢 May 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      llmops · mlops · generative-ai · hacktoberfest · data-quality
```

</details>

<details><summary>🟡 <b>5</b> <b><a href="https://github.com/deepchecks/deepchecks">Deepchecks</a></b> <code>⭐ 4.0K</code> <code>NOASSERTION</code> Holistic ML validation suite for data and models</summary>

<br>

Holistic ML validation covering data integrity, drift detection, and model evaluation in a single suite. **Quiet - no commits for 6+ months.**

```
  Score     52/100
  Stars     ⭐ 4,047 (+8 last 32d, +2 last 7d)
  Activity  🟡 Nov 2025
  Release   📦 Dec 2024
  License   NOASSERTION
  Tags      mlops · jupyter-notebook · pandas-dataframe · data-drift · data-validation
```

</details>

<details><summary>🟡 <b>6</b> <b><a href="https://github.com/SeldonIO/alibi-detect">Alibi Detect</a></b> <code>⭐ 2.5K</code> <code>NOASSERTION</code> Outlier, adversarial, and drift detection across data types</summary>

<br>

Outlier, adversarial, and drift detection algorithms for tabular, text, image, and time-series data (Seldon). **Quiet - no commits for 6+ months.**

```
  Score     51/100
  Stars     ⭐ 2,548 (+8 last 32d, +2 last 7d)
  Activity  🟡 Dec 2025
  Release   📦 Dec 2025
  License   NOASSERTION
  Tags      time-series · tabular-data · data-drift · images
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/whylabs/whylogs">WhyLogs</a></i> <code>⭐ 2.8K</code> <code>Apache-2.0</code> Lightweight drift detection without storing raw data</summary>

<br>

*Lightweight data logging library that profiles datasets for drift detection without storing raw data. **Evidently covers drift and data quality for new work.***

```
  Score     52/100
  Stars     ⭐ 2,832 (n/a)
  Activity  🔴 Jan 2025 - unmaintained 12+ months
  Release   📦 Dec 2024
  License   Apache-2.0
  Tags      mlops · data-quality · analytics · dataset
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/NannyML/nannyml">NannyML</a></i> <code>⭐ 2.1K</code> <code>Apache-2.0</code> Estimate model performance without ground truth labels</summary>

<br>

*Estimate model performance without ground truth labels and link data drift directly to accuracy degradation. **Evidently covers post-deployment monitoring for new work.***

```
  Score     52/100
  Stars     ⭐ 2,149 (n/a)
  Activity  🔴 Jul 2025 - unmaintained 12+ months
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      mlops · data-analysis · jupyter-notebook · data-drift · model-monitoring
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated AI Safety

*Tools for automated safety testing, alignment evaluation, jailbreak detection, and guardrails on deployed AI systems.*

<details><summary>🟢 🥇 <b><a href="https://github.com/NVIDIA/garak">Garak</a></b> <code>⭐ 8.9K</code> <code>↗️ +377</code> <code>Apache-2.0</code> LLM vulnerability scanner with 100+ attack modules</summary>

<br>

LLM vulnerability scanner with 100+ attack modules covering prompt injection, data leakage, and jailbreaking.

```
  Score     78/100
  Stars     ⭐ 8,883 (+377 last 32d, +84 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llm-evaluation · llm-security
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/confident-ai/deepteam">DeepTeam</a></b> <code>⭐ 2.6K</code> <code>↗️ +320</code> <code>Apache-2.0</code> Systematic red-teaming for LLM vulnerabilities</summary>

<br>

Red-teaming framework for systematically testing LLM vulnerabilities across multiple attack vectors.

```
  Score     78/100
  Stars     ⭐ 2,587 (+320 last 32d, +142 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      hacktoberfest · llm-safety
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/microsoft/PyRIT">PyRIT</a></b> <code>⭐ 4.3K</code> <code>MIT</code> Automated red teaming for generative AI</summary>

<br>

Automated red-teaming framework for generative AI that runs multi-turn attack strategies against a target and scores the responses for risk.

```
  Score     76/100
  Stars     ⭐ 4,342 (+46 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   MIT
  Tags      generative-ai · responsible-ai · ai-red-team · red-team-tools
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/katanemo/plano">Plano</a></b> <code>⭐ 7.0K</code> <code>↗️ +139</code> <code>Apache-2.0</code> AI-native proxy with safety controls for agentic apps</summary>

<br>

AI-native proxy with built-in orchestration, safety controls, and observability for agentic applications.

```
  Score     73/100
  Stars     ⭐ 7,011 (+139 last 32d, +13 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llmops · openai · llms · generative-ai · llm-inference
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/guardrails-ai/guardrails">Guardrails AI</a></b> <code>⭐ 7.3K</code> <code>↗️ +123</code> <code>Apache-2.0</code> Structural and semantic validation guardrails for LLM outputs</summary>

<br>

Framework for adding structural and semantic validation guardrails to LLM outputs.

```
  Score     72/100
  Stars     ⭐ 7,304 (+123 last 32d, +20 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      openai · foundation-model · gpt-3
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/NVIDIA-NeMo/Guardrails">NeMo Guardrails</a></b> <code>⭐ 7.0K</code> <code>↗️ +245</code> <code>NOASSERTION</code> Programmable topical and safety rails for LLM conversations</summary>

<br>

Programmable safety rails for LLM-based conversational systems with topical and safety controls (NVIDIA).

```
  Score     72/100
  Stars     ⭐ 6,989 (+245 last 32d, +41 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   NOASSERTION
  Tags      agents · llms · generative-ai · llm-security · nvidia
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/protectai/llm-guard">LLM Guard</a></i> <code>⭐ 3.2K</code> <code>MIT</code> Input/output scanners for prompt injection and leakage</summary>

<br>

*Security toolkit with input/output scanners for prompt injection, data leakage, toxic content, and other safety risks in production LLM applications. **Archived. Project wound down; repository archived upstream.***

```
  Score     0/100
  Stars     ⭐ 3,201 (n/a)
  Activity  🔴 Jul 2026 - archived
  License   MIT
  Tags      llmops · transformers · large-language-models · prompt-engineering · chatgpt
```

</details>


**[⬆ Back to Contents](#contents)**

## Time-Series AutoML

*Automated forecasting, classification, and anomaly detection for temporal data, including modern time-series foundation models.*

<details><summary>🟢 🥇 <b><a href="https://github.com/google-research/timesfm">TimesFM</a></b> <code>⭐ 28.1K</code> <code>↗️ +1087</code> <code>Apache-2.0</code> Zero-shot time-series forecasting foundation model</summary>

<br>

Time-series foundation model for zero-shot forecasting across domains without task-specific training (Google).

```
  Score     78/100
  Stars     ⭐ 28,070 (+1087 last 32d, +764 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      time-series · forecasting · foundation-models · google · pretrained-models
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/sktime/sktime">sktime</a></b> <code>⭐ 10.0K</code> <code>↗️ +91</code> <code>BSD-3-Clause</code> Unified sklearn-compatible time-series ML toolkit</summary>

<br>

Unified framework for time-series forecasting, classification, regression, and clustering with scikit-learn-compatible interfaces.

```
  Score     72/100
  Stars     ⭐ 9,956 (+91 last 32d, +37 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   BSD-3-Clause
  Tags      time-series · forecasting · scikit-learn · hacktoberfest · anomaly-detection
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/amazon-science/chronos-forecasting">Chronos</a></b> <code>⭐ 5.7K</code> <code>↗️ +92</code> <code>Apache-2.0</code> Pretrained probabilistic forecasting on unseen time-series</summary>

<br>

Pretrained time-series foundation model for zero-shot probabilistic forecasting on unseen data (Amazon).

```
  Score     71/100
  Stars     ⭐ 5,730 (+92 last 32d, +25 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      time-series · forecasting · transformers · large-language-models · foundation-models
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/unit8co/darts">Darts</a></b> <code>⭐ 9.5K</code> <code>↗️ +29</code> <code>Apache-2.0</code> Unified API for 30+ forecasting models with backtesting</summary>

<br>

Unified API for 30+ forecasting models from ARIMA to transformers, with backtesting and ensembling built in.

```
  Score     71/100
  Stars     ⭐ 9,497 (+29 last 32d, +6 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      time-series · forecasting · anomaly-detection
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/Nixtla/statsforecast">Nixtla StatsForecast</a></b> <code>⭐ 4.9K</code> <code>↗️ +33</code> <code>Apache-2.0</code> Lightning-fast AutoARIMA and AutoETS at scale</summary>

<br>

Lightning-fast statistical models including AutoARIMA, AutoETS, and AutoCES for millions of time series.

```
  Score     69/100
  Stars     ⭐ 4,875 (+33 last 32d, +9 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      time-series · forecasting · statistics · arima · baselines
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/Nixtla/neuralforecast">Nixtla NeuralForecast</a></b> <code>⭐ 4.2K</code> <code>↗️ +37</code> <code>Apache-2.0</code> Production neural forecasting with 30+ models</summary>

<br>

Production-ready neural forecasting with 30+ state-of-the-art models including N-BEATS, TFT, and PatchTST.

```
  Score     69/100
  Stars     ⭐ 4,247 (+37 last 32d, +10 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      time-series · forecasting · neural-network · transformer · baselines
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/aeon-toolkit/aeon">aeon</a></b> <code>⭐ 1.4K</code> <code>↗️ +18</code> <code>BSD-3-Clause</code> Next-generation time-series ML for all task types</summary>

<br>

Next-generation time-series ML toolkit for classification, regression, clustering, and anomaly detection.

```
  Score     66/100
  Stars     ⭐ 1,435 (+18 last 32d, +2 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   BSD-3-Clause
  Tags      time-series · forecasting · scikit-learn · artificial-intelligence · neural-network
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/Nixtla/mlforecast">Nixtla MLForecast</a></b> <code>⭐ 1.3K</code> <code>↗️ +15</code> <code>Apache-2.0</code> Scalable LightGBM and XGBoost time-series forecasting</summary>

<br>

Scalable ML-based forecasting with LightGBM, XGBoost, and distributed backends via Dask, Spark, and Ray.

```
  Score     65/100
  Stars     ⭐ 1,269 (+15 last 32d, +4 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      time-series · forecasting · xgboost · lightgbm
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/skforecast/skforecast">skforecast</a></b> <code>⭐ 1.5K</code> <code>BSD-3-Clause</code> Sklearn-compatible multi-step forecasting with gradient boosting</summary>

<br>

Scikit-learn-compatible multi-step forecasting with XGBoost, LightGBM, CatBoost, and feature engineering utilities.

```
  Score     64/100
  Stars     ⭐ 1,526 (+6 last 32d, +2 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   BSD-3-Clause
  Tags      time-series · forecasting · scikit-learn · xgboost · lightgbm
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/winedarksea/AutoTS">AutoTS</a></b> <code>⭐ 1.4K</code> <code>MIT</code> Genetic algorithm AutoML for time-series forecasting</summary>

<br>

Genetic algorithm-based automated model selection, ensembling, and anomaly detection for time-series data.

```
  Score     64/100
  Stars     ⭐ 1,428 (+5 last 32d, +4 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      time-series · forecasting · feature-engineering · preprocessing
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/ibm-granite/granite-tsfm">Granite-TSFM</a></b> <code>⭐ 883</code> <code>↗️ +10</code> <code>Apache-2.0</code> Compact mixers rivaling billion-parameter forecasting models</summary>

<br>

Compact pretrained Tiny Time Mixers that rival billion-parameter models for zero/few-shot multivariate forecasting (IBM, NeurIPS 2024).

```
  Score     63/100
  Stars     ⭐ 883 (+10 last 32d, 0 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      time-series · forecasting · foundation-models
```

</details>

<details><summary>🟡 <b>12</b> <b><a href="https://github.com/SalesforceAIResearch/uni2ts">Moirai</a></b> <code>⭐ 1.6K</code> <code>↗️ +25</code> <code>Apache-2.0</code> Universal multivariate time-series forecasting transformer</summary>

<br>

Universal time-series forecasting transformer supporting multivariate forecasting unlike most competitors. Moirai-MoE released Oct 2024 (Salesforce). **Quiet - minimal recent development.**

```
  Score     62/100
  Stars     ⭐ 1,576 (+25 last 32d, +5 last 7d)
  Activity  🟡 Jun 2026
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      time-series · forecasting · transformers
```

</details>

<details><summary>🟢 <b>13</b> <b><a href="https://github.com/WenjieDu/PyPOTS">PyPOTS</a></b> <code>⭐ 2.0K</code> <code>↗️ +15</code> <code>BSD-3-Clause</code> 50+ models for missing-value time-series analysis</summary>

<br>

Toolbox with 50+ deep learning models for partially-observed time-series imputation, classification, and clustering.

```
  Score     61/100
  Stars     ⭐ 2,047 (+15 last 32d, +2 last 7d)
  Activity  🟢 Jun 2026
  Release   📦 May 2026
  License   BSD-3-Clause
  Tags      time-series · forecasting · classification · anomaly-detection · data-analysis
```

</details>

<details><summary>🟡 <b>14</b> <b><a href="https://github.com/Time-MoE/Time-MoE">Time-MoE</a></b> <code>⭐ 991</code> <code>Apache-2.0</code> Billion-scale sparse MoE time-series foundation model</summary>

<br>

First billion-scale time-series foundation model using sparse mixture-of-experts, trained on 300B+ time points (ICLR 2025 Spotlight). **Quiet - minimal recent development.**

```
  Score     55/100
  Stars     ⭐ 991 (+8 last 32d, 0 last 7d)
  Activity  🟡 Mar 2026
  License   Apache-2.0
  Tags      time-series
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/time-series-foundation-models/lag-llama">Lag-Llama</a></i> <code>⭐ 1.6K</code> <code>Apache-2.0</code> First open-source probabilistic time-series foundation model</summary>

<br>

*First open-source foundation model for univariate probabilistic time-series forecasting based on a decoder-only transformer (NeurIPS 2024). **Chronos and TimesFM are the maintained foundation models here.***

```
  Score     51/100
  Stars     ⭐ 1,601 (n/a)
  Activity  🔴 Jun 2025 - unmaintained 12+ months
  License   Apache-2.0
  Tags      time-series · forecasting · transformers · llama · foundation-models
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Data Preprocessing

*Automated cleaning, transformation, imputation, and quality assessment for raw data before training.*

<details><summary>🟢 🥇 <b><a href="https://github.com/microsoft/data-formulator">Data Formulator</a></b> <code>⭐ 16.8K</code> <code>↗️ +837</code> <code>MIT</code> AI-driven data transformation and charts</summary>

<br>

Microsoft Research tool that uses AI to iteratively transform, reshape, and visualize tabular data through a concept-driven chart authoring UI.

```
  Score     81/100
  Stars     ⭐ 16,803 (+837 last 32d, +776 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      visualization
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/data-privacy-stack/presidio">Presidio</a></b> <code>⭐ 10.6K</code> <code>↗️ +496</code> <code>MIT</code> PII detection and anonymization framework</summary>

<br>

PII detection and anonymization framework that redacts, masks, and de-identifies sensitive data across text, images, and structured records.

```
  Score     78/100
  Stars     ⭐ 10,574 (+496 last 32d, +94 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   MIT
  Tags      transformers · nlp · privacy · guardrails
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/fivetran/great_expectations">Great Expectations</a></b> <code>⭐ 11.7K</code> <code>↗️ +71</code> <code>Apache-2.0</code> Programmable data validation for pipeline quality</summary>

<br>

Programmable data validation and documentation framework for maintaining pipeline quality.

```
  Score     72/100
  Stars     ⭐ 11,727 (+71 last 32d, +18 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      mlops · data-quality · data-engineering · exploratory-data-analysis · data-profiling
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/NVIDIA-NeMo/Curator">NeMo Curator</a></b> <code>⭐ 1.7K</code> <code>↗️ +56</code> <code>Apache-2.0</code> GPU-scale LLM data curation toolkit</summary>

<br>

NVIDIA's GPU-accelerated toolkit for scalable LLM data curation with quality filtering, exact and semantic deduplication, and PII redaction.

```
  Score     70/100
  Stars     ⭐ 1,728 (+56 last 32d, +14 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      fine-tuning · large-language-models · data-quality · data-curation · data-processing
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/unionai-oss/pandera">Pandera</a></b> <code>⭐ 4.4K</code> <code>↗️ +28</code> <code>MIT</code> Statistical schema validation for dataframes</summary>

<br>

Statistical data testing and validation for dataframes with expressive schema definitions.

```
  Score     69/100
  Stars     ⭐ 4,437 (+28 last 32d, +6 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   MIT
  Tags      pandas-dataframe · data-validation · data-cleaning · data-processing · testing
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/Data-Centric-AI-Community/fg-data-profiling">ydata-profiling</a></b> <code>⭐ 13.7K</code> <code>↗️ +34</code> <code>MIT</code> One-line EDA profiling for Pandas and Spark</summary>

<br>

One-line data quality profiling and exploratory analysis for Pandas and Spark DataFrames.

```
  Score     65/100
  Stars     ⭐ 13,681 (+34 last 32d, +11 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      hacktoberfest · data-quality · data-analysis · exploratory-data-analysis · jupyter-notebook
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/Renumics/spotlight">Spotlight</a></b> <code>⭐ 1.3K</code> <code>MIT</code> Interactive auditing of unstructured ML datasets</summary>

<br>

Interactive visualization tool for auditing and understanding unstructured ML datasets covering images, audio, and text.

```
  Score     64/100
  Stars     ⭐ 1,272 (+4 last 32d, 0 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      hacktoberfest · computer-vision · exploratory-data-analysis · data-curation · data-visualization
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/pyjanitor-devs/pyjanitor">pyjanitor</a></b> <code>⭐ 1.5K</code> <code>MIT</code> Fluent method-chaining data cleaning for pandas</summary>

<br>

Clean APIs for data cleaning with a fluent method-chaining interface for pandas DataFrames, inspired by the R Janitor package.

```
  Score     64/100
  Stars     ⭐ 1,498 (-2 last 32d, -2 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      hacktoberfest · data · pandas
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/fbdesignpro/sweetviz">SweetViz</a></b> <code>⭐ 3.1K</code> <code>MIT</code> High-density EDA visualizations in two lines of code</summary>

<br>

High-density EDA visualizations and target analysis reports generated in two lines of code.

```
  Score     59/100
  Stars     ⭐ 3,115 (-1 last 32d, -1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      data-analysis · exploratory-data-analysis · pandas-dataframe · data-profiling · data-visualization
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Data Labeling

*Programmatic and semi-automated tools for labeling training data, including weak supervision and active learning.*

<details><summary>🟢 🥇 <b><a href="https://github.com/HumanSignal/label-studio">Label Studio</a></b> <code>⭐ 28.1K</code> <code>↗️ +219</code> <code>Apache-2.0</code> ML-assisted labeling for text, images, audio, video</summary>

<br>

Multi-type data labeling platform with ML-assisted annotation and LLM integration for text, images, audio, and video.

```
  Score     76/100
  Stars     ⭐ 28,103 (+219 last 32d, +46 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      mlops · computer-vision · dataset · annotation · data-labeling
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/CVHub520/X-AnyLabeling">X-AnyLabeling</a></b> <code>⭐ 10.1K</code> <code>↗️ +342</code> <code>GPL-3.0</code> SAM-powered annotation for auto-segmentation and detection</summary>

<br>

AI-assisted annotation with Segment Anything and other foundation models for automatic segmentation, detection, and classification pre-labeling.

```
  Score     76/100
  Stars     ⭐ 10,144 (+342 last 32d, +75 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   GPL-3.0
  Tags      artificial-intelligence · computer-vision · object-detection · image-classification · yolo
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/opendatalab/labelU">LabelU</a></b> <code>⭐ 1.7K</code> <code>↗️ +35</code> <code>Apache-2.0</code> Multi-modal annotation for image, audio, and video</summary>

<br>

Multi-modal annotation toolbox supporting image, audio, and video with configurable templates and collaborative labeling workflows.

```
  Score     66/100
  Stars     ⭐ 1,664 (+35 last 32d, +10 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      computer-vision · annotation · data-labeling · labeling-tool · audio
```

</details>

<details><summary>🟡 <b>4</b> <b><a href="https://github.com/HumanSignal/Adala">Adala</a></b> <code>⭐ 1.6K</code> <code>Apache-2.0</code> Autonomous LLM agent iteratively improving labeling quality</summary>

<br>

Autonomous data labeling agent that uses LLMs to label data, learn from ground truth, and iteratively improve labeling quality (Label Studio team). **No stable release for 24+ months.**

```
  Score     64/100
  Stars     ⭐ 1,620 (+4 last 32d, 0 last 7d)
  Activity  🟡 Aug 2026
  Release   📦 Nov 2023
  License   Apache-2.0
  Tags      agent · autonomous-agents · gpt-4
```

</details>

<details><summary>🟡 <b>5</b> <b><a href="https://github.com/cleanlab/cleanlab">Cleanlab</a></b> <code>⭐ 11.6K</code> <code>↗️ +49</code> <code>Apache-2.0</code> Automatically find and fix label errors in datasets</summary>

<br>

Data-centric AI toolkit for finding and fixing label errors, outliers, and data quality issues automatically. **Quiet - no commits for 6+ months.**

```
  Score     62/100
  Stars     ⭐ 11,630 (+49 last 32d, +3 last 7d)
  Activity  🟡 Jan 2026
  Release   📦 Jan 2026
  License   Apache-2.0
  Tags      data-quality · anomaly-detection · exploratory-data-analysis · data-profiling · data-validation
```

</details>

<details><summary>🟡 <b>6</b> <b><a href="https://github.com/snorkel-team/snorkel">Snorkel</a></b> <code>⭐ 6.0K</code> <code>Apache-2.0</code> Write labeling functions instead of hand-labeling data</summary>

<br>

Programmatic labeling via weak supervision - write labeling functions instead of hand-labeling. **No stable release for 24+ months.**

```
  Score     61/100
  Stars     ⭐ 5,998 (+6 last 32d, -4 last 7d)
  Activity  🟡 Apr 2026
  Release   📦 Feb 2024
  License   Apache-2.0
  Tags      labeling · weak-supervision · data-augmentation
```

</details>

<details><summary>🟡 <b>7</b> <b><a href="https://github.com/argilla-io/distilabel">Distilabel</a></b> <code>⭐ 3.4K</code> <code>↗️ +43</code> <code>Apache-2.0</code> Synthetic data generation with Self-Instruct and EvolInstruct</summary>

<br>

Framework for synthetic data generation, AI feedback, and instruction tuning using Self-Instruct and EvolInstruct techniques. **Quiet - no commits for 6+ months.**

```
  Score     58/100
  Stars     ⭐ 3,376 (+43 last 32d, +9 last 7d)
  Activity  🟡 Dec 2025
  Release   📦 Jan 2025
  License   Apache-2.0
  Tags      openai · llms · huggingface · synthetic-data · rlhf
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/argilla-io/argilla">Argilla</a></i> <code>⭐ 5.1K</code> <code>Apache-2.0</code> Collaborative human and AI feedback for LLM development</summary>

<br>

*Collaboration platform for collecting and managing human and AI feedback for NLP and LLM development. **Label Studio is the maintained labeling platform.***

```
  Score     57/100
  Stars     ⭐ 5,081 (n/a)
  Activity  🔴 Aug 2025 - unmaintained 12+ months
  Release   📦 Mar 2025
  License   Apache-2.0
  Tags      mlops · nlp · developer-tools · langchain · natural-language-processing
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/autodistill/autodistill">Autodistill</a></i> <code>⭐ 2.8K</code> <code>Apache-2.0</code> Distill foundation models into task-specific labelers</summary>

<br>

*Automated image labeling by distilling foundation model knowledge into smaller task-specific models (Roboflow). **Label Studio and X-AnyLabeling are the maintained labeling tools.***

```
  Score     53/100
  Stars     ⭐ 2,760 (n/a)
  Activity  🔴 May 2025 - unmaintained 12+ months
  Release   📦 Feb 2024
  License   Apache-2.0
  Tags      foundation-models · computer-vision · multimodal · object-detection · image-classification
```

</details>


**[⬆ Back to Contents](#contents)**

## Synthetic Data Generation

*Automated creation of artificial training data that preserves statistical properties of real datasets, with optional privacy guarantees.*

<details><summary>🟢 🥇 <b><a href="https://github.com/NVIDIA-NeMo/DataDesigner">NeMo Data Designer</a></b> <code>⭐ 2.2K</code> <code>↗️ +61</code> <code>Apache-2.0</code> Generates and evaluates synthetic data for LLM pipelines</summary>

<br>

Generates high-quality synthetic data from scratch or seed data with built-in evaluation and quality control for LLM training pipelines (NVIDIA).

```
  Score     70/100
  Stars     ⭐ 2,170 (+61 last 32d, +14 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      mcp · agentic-ai · synthetic-data · multimodal · nvidia
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/sdv-dev/SDV">SDV</a></b> <code>⭐ 3.5K</code> <code>↗️ +19</code> <code>NOASSERTION</code> Synthetic tabular data vault with multiple generative models</summary>

<br>

Synthetic Data Vault with multiple generative models (GaussianCopula, CTGAN, TVAE) for single-table, multi-table, and sequential data.

```
  Score     64/100
  Stars     ⭐ 3,548 (+19 last 32d, +5 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      time-series · generative-ai · synthetic-data · data-generation · gan
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/bespokelabsai/curator">Curator</a></b> <code>⭐ 1.7K</code> <code>↗️ +14</code> <code>Apache-2.0</code> Pipeline synthetic data curation with LLM quality filtering</summary>

<br>

Pipeline-oriented synthetic data curation for post-training and structured data extraction with built-in quality filtering from LLMs.

```
  Score     63/100
  Stars     ⭐ 1,718 (+14 last 32d, -1 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      agents · fine-tuning · natural-language-processing · synthetic-data · instruction-tuning
```

</details>

<details><summary>🟡 <b>4</b> <b><a href="https://github.com/meta-llama/synthetic-data-kit">Synthetic Data Kit</a></b> <code>⭐ 1.6K</code> <code>↗️ +13</code> <code>MIT</code> LLM-generated training data at scale for fine-tuning</summary>

<br>

Toolkit for generating high-quality synthetic datasets to fine-tune models with LLM-generated training data at scale (Meta). **Quiet - no commits for 6+ months.**

```
  Score     53/100
  Stars     ⭐ 1,630 (+13 last 32d, +3 last 7d)
  Activity  🟡 Oct 2025
  License   MIT
  Tags      data · generation
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/hitsz-ids/synthetic-data-generator">SDG</a></i> <code>⭐ 2.4K</code> <code>Apache-2.0</code> Synthetic tabular data preserving statistical distributions</summary>

<br>

*Framework for generating high-quality synthetic tabular data preserving statistical distributions and correlations. **SDV is the maintained synthetic-data toolkit.***

```
  Score     52/100
  Stars     ⭐ 2,434 (n/a)
  Activity  🔴 Mar 2025 - unmaintained 12+ months
  Release   📦 Dec 2024
  License   Apache-2.0
  Tags      agent · generative-ai · tabular-data · synthetic-data · privacy
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/datadreamer-dev/DataDreamer">DataDreamer</a></i> <code>⭐ 1.1K</code> <code>MIT</code> Reproducible LLM pipelines for synthetic data and training</summary>

<br>

*Reproducible LLM workflows for prompting, synthetic data generation, and model training in one pipeline. **Curator and NeMo Data Designer cover synthetic data generation.***

```
  Score     49/100
  Stars     ⭐ 1,117 (n/a)
  Activity  🔴 Feb 2025 - unmaintained 12+ months
  Release   📦 Feb 2025
  License   MIT
  Tags      llmops · openai · llms · transformers · fine-tuning
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Model Compression

*Automated quantization, pruning, distillation, and low-rank compression for efficient inference.*

<details><summary>🟢 🥇 <b><a href="https://github.com/NVIDIA/Model-Optimizer">NVIDIA TensorRT Model Optimizer</a></b> <code>⭐ 3.5K</code> <code>↗️ +199</code> <code>Apache-2.0</code> Quantization and pruning optimized for TensorRT and vLLM</summary>

<br>

Quantization, pruning, distillation, and speculative decoding optimized for TensorRT and vLLM deployment.

```
  Score     77/100
  Stars     ⭐ 3,463 (+199 last 32d, +21 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      inference · quantization · model-compression · nvidia · pruning
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/vllm-project/llm-compressor">LLM Compressor</a></b> <code>⭐ 3.7K</code> <code>↗️ +146</code> <code>Apache-2.0</code> Transformers-compatible compression optimized for vLLM</summary>

<br>

Transformers-compatible compression library optimized for efficient vLLM inference.

```
  Score     74/100
  Stars     ⭐ 3,706 (+146 last 32d, +31 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      quantization
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/bitsandbytes-foundation/bitsandbytes">bitsandbytes</a></b> <code>⭐ 8.4K</code> <code>↗️ +94</code> <code>MIT</code> De facto 4-bit and 8-bit LLM quantization for PyTorch</summary>

<br>

De facto standard for k-bit quantization of LLMs in PyTorch - enables 4-bit and 8-bit inference and training, the backbone for QLoRA.

```
  Score     72/100
  Stars     ⭐ 8,427 (+94 last 32d, +14 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      quantization · qlora
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/huggingface/optimum">Optimum</a></b> <code>⭐ 3.5K</code> <code>↗️ +17</code> <code>Apache-2.0</code> Hardware-optimized Transformers inference and quantization</summary>

<br>

Toolkit for accelerating Transformers inference with hardware-optimized quantization, pruning, and graph optimization for ONNX Runtime, OpenVINO, and more (Hugging Face).

```
  Score     68/100
  Stars     ⭐ 3,464 (+17 last 32d, +3 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      transformers · inference · quantization · optimization · onnx
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/intel/neural-compressor">Intel Neural Compressor</a></b> <code>⭐ 2.7K</code> <code>↗️ +15</code> <code>Apache-2.0</code> Unified quantization and pruning across PyTorch and ONNX</summary>

<br>

Unified quantization, sparsity, pruning, and distillation across PyTorch, TensorFlow, and ONNX (Intel).

```
  Score     67/100
  Stars     ⭐ 2,699 (+15 last 32d, +2 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   Apache-2.0
  Tags      large-language-models · quantization · pruning · awq · gptq
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/microsoft/Olive">Olive</a></b> <code>⭐ 2.4K</code> <code>↗️ +25</code> <code>MIT</code> End-to-end model optimization for CPU, GPU, and NPU</summary>

<br>

End-to-end model optimization automating fine-tuning, conversion, quantization, and graph optimization for CPUs, GPUs, and NPUs (Microsoft).

```
  Score     67/100
  Stars     ⭐ 2,380 (+25 last 32d, +1 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   MIT
  Tags      fine-tuning · inference · quantization · optimization · model-compression
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/ModelCloud/GPTQModel">GPTQModel</a></b> <code>⭐ 1.2K</code> <code>↗️ +28</code> <code>NOASSERTION</code> LLM quantization for CUDA, ROCm, and Apple Silicon</summary>

<br>

LLM quantization toolkit with support for NVIDIA CUDA, AMD ROCm, Intel, and Apple Silicon backends.

```
  Score     63/100
  Stars     ⭐ 1,236 (+28 last 32d, +8 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      transformers · quantization · peft · vllm · gptq
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/pytorch/ao">torchao</a></b> <code>⭐ 3.0K</code> <code>NOASSERTION</code> PyTorch-native quantization and sparsity</summary>

<br>

PyTorch-native quantization and sparsity library covering int4, int8, float8, and MX formats for both training and inference.

```
  Score     63/100
  Stars     ⭐ 2,951 (+3 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      inference · quantization · transformer · cuda · sparsity
```

</details>

<details><summary>🟡 <b>9</b> <b><a href="https://github.com/VainF/Torch-Pruning">Torch-Pruning</a></b> <code>⭐ 3.3K</code> <code>↗️ +19</code> <code>MIT</code> Structural pruning for any PyTorch model</summary>

<br>

Structural pruning framework for any PyTorch model including LLMs, YOLO, ViT, and diffusion models (CVPR 2023). **Quiet - no commits for 6+ months.**

```
  Score     55/100
  Stars     ⭐ 3,346 (+19 last 32d, +3 last 7d)
  Activity  🟡 Sep 2025
  Release   📦 Sep 2025
  License   MIT
  Tags      transformers · model-compression · pruning
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/mit-han-lab/llm-awq">LLM-AWQ</a></i> <code>⭐ 3.6K</code> <code>MIT</code> Lossless 4-bit LLM quantization via activation awareness</summary>

<br>

*Activation-aware weight quantization achieving lossless 4-bit compression for LLMs (MIT HAN Lab, MLSys 2024 Best Paper). **Superseded by LLM Compressor for production quantization.***

```
  Score     55/100
  Stars     ⭐ 3,619 (n/a)
  Activity  🔴 Jul 2025 - unmaintained 12+ months
  License   MIT
  Tags      inference · quantization · model-compression · awq
```

</details>


**[⬆ Back to Contents](#contents)**

## MLOps and Experiment Tracking

*Platforms for managing the ML lifecycle - experiment tracking, model registry, pipeline orchestration, and feature stores.*

<details><summary>🟢 🥇 <b><a href="https://github.com/langfuse/langfuse">Langfuse</a></b> <code>⭐ 33.5K</code> <code>↗️ +2048</code> <code>NOASSERTION</code> Open-source LLM tracing, evals, and prompt management</summary>

<br>

Open-source LLM engineering platform with tracing, evaluations, prompt management, and cost analytics.

```
  Score     82/100
  Stars     ⭐ 33,508 (+2048 last 32d, +414 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      llmops · openai · evaluation · large-language-models · llm-evaluation
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/comet-ml/opik">Opik</a></b> <code>⭐ 21.5K</code> <code>↗️ +797</code> <code>Apache-2.0</code> LLM debugging, evaluation, and quality dashboards</summary>

<br>

LLM debugging, evaluation, and monitoring platform with detailed tracing and quality dashboards (Comet).

```
  Score     80/100
  Stars     ⭐ 21,511 (+797 last 32d, +133 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llmops · openai · evaluation · llm-evaluation · prompt-engineering
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/mlflow/mlflow">MLflow</a></b> <code>⭐ 27.6K</code> <code>↗️ +491</code> <code>Apache-2.0</code> End-to-end ML lifecycle with experiment tracking and registry</summary>

<br>

End-to-end ML lifecycle platform with experiment tracking, model registry, and integrated prompt optimization.

```
  Score     78/100
  Stars     ⭐ 27,601 (+491 last 32d, +84 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agents · llmops · mlops · openai · evaluation
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/ray-project/ray">Ray</a></b> <code>⭐ 43.6K</code> <code>↗️ +287</code> <code>Apache-2.0</code> Unified distributed AI compute; see Ray Tune for HPO</summary>

<br>

Unified AI compute engine for distributed training, tuning, and model serving with Ray Train, Ray Tune, and Ray Serve.

```
  Score     77/100
  Stars     ⭐ 43,576 (+287 last 32d, +63 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      hyperparameter-optimization · large-language-models · tensorflow · optimization · llm-inference
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/PrefectHQ/prefect">Prefect</a></b> <code>⭐ 23.6K</code> <code>↗️ +212</code> <code>Apache-2.0</code> Modern data workflow automation with retries and caching</summary>

<br>

Modern data workflow automation with retries, caching, and real-time logging.

```
  Score     75/100
  Stars     ⭐ 23,647 (+212 last 32d, +27 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      observability · orchestration · data · workflow · pipeline
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/Arize-ai/phoenix">Phoenix</a></b> <code>⭐ 11.1K</code> <code>↗️ +500</code> <code>NOASSERTION</code> OpenTelemetry-native AI observability and LLM evaluation</summary>

<br>

AI observability platform with OpenTelemetry-native tracing and LLM evaluation dashboards (Arize).

```
  Score     75/100
  Stars     ⭐ 11,134 (+500 last 32d, +86 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      agents · llmops · openai · llms · llm-evaluation
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/dagster-io/dagster">Dagster</a></b> <code>⭐ 16.0K</code> <code>↗️ +174</code> <code>Apache-2.0</code> Asset-centric ML pipeline orchestration with lineage tracking</summary>

<br>

Asset-centric orchestration built for ML pipelines with data lineage tracking and observability.

```
  Score     74/100
  Stars     ⭐ 16,043 (+174 last 32d, +49 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      mlops · orchestration · analytics · data-engineering · workflow
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/treeverse/dvc">DVC</a></b> <code>⭐ 15.8K</code> <code>↗️ +66</code> <code>Apache-2.0</code> Git-like version control for data and ML models</summary>

<br>

Version control for data and models with built-in experiment tracking and pipeline management.

```
  Score     72/100
  Stars     ⭐ 15,831 (+66 last 32d, +14 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      developer-tools · reproducibility · unstructured-data
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/wandb/wandb">W&B</a></b> <code>⭐ 11.2K</code> <code>↗️ +42</code> <code>MIT</code> Experiment tracking and visualization for ML teams</summary>

<br>

Experiment tracking, visualization, and collaboration platform for ML teams (Weights and Biases).

```
  Score     72/100
  Stars     ⭐ 11,235 (+42 last 32d, +5 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      mlops · hyperparameter-optimization · tensorflow · reinforcement-learning · hyperparameter-tuning
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/feast-dev/feast">Feast</a></b> <code>⭐ 7.2K</code> <code>↗️ +82</code> <code>Apache-2.0</code> Open-source feature store for real-time and batch ML</summary>

<br>

Open-source feature store for managing and serving ML features in real-time and batch inference.

```
  Score     72/100
  Stars     ⭐ 7,224 (+82 last 32d, +17 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      mlops · data-quality · data-engineering · big-data · feature-store
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/Netflix/metaflow">Metaflow</a></b> <code>⭐ 10.2K</code> <code>↗️ +40</code> <code>Apache-2.0</code> Human-centric framework for real-life ML projects at scale</summary>

<br>

Human-centric framework for managing real-life data science and ML projects at scale (Netflix).

```
  Score     71/100
  Stars     ⭐ 10,228 (+40 last 32d, +16 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agents · llmops · mlops · generative-ai · kubernetes
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/clearml/clearml">ClearML</a></b> <code>⭐ 6.8K</code> <code>↗️ +49</code> <code>Apache-2.0</code> Unified experiment manager and pipeline orchestrator</summary>

<br>

Unified experiment manager, pipeline orchestrator, and data/model management platform.

```
  Score     71/100
  Stars     ⭐ 6,833 (+49 last 32d, +14 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      mlops · machinelearning · deeplearning · k8s
```

</details>

<details><summary>🟢 <b>13</b> <b><a href="https://github.com/zenml-io/zenml">ZenML</a></b> <code>⭐ 5.6K</code> <code>↗️ +68</code> <code>Apache-2.0</code> Portable production-ready ML pipelines on any infrastructure</summary>

<br>

Framework for building portable, production-ready ML pipelines that run on any infrastructure.

```
  Score     71/100
  Stars     ⭐ 5,556 (+68 last 32d, -1 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      agents · llmops · mlops · tensorflow · genai
```

</details>

<details><summary>🟢 <b>14</b> <b><a href="https://github.com/kubeflow/kubeflow">Kubeflow</a></b> <code>⭐ 15.8K</code> <code>↗️ +41</code> <code>Apache-2.0</code> Kubernetes ML toolkit for portable scalable pipelines</summary>

<br>

ML toolkit on Kubernetes for building portable, scalable ML pipelines and training workflows.

```
  Score     70/100
  Stars     ⭐ 15,824 (+41 last 32d, +11 last 7d)
  Activity  🟢 Jul 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ml · tensorflow · kubernetes · jupyter · kubeflow
```

</details>

<details><summary>🟢 <b>15</b> <b><a href="https://github.com/kedro-org/kedro">Kedro</a></b> <code>⭐ 11.0K</code> <code>↗️ +33</code> <code>NOASSERTION</code> Reproducible, maintainable ML pipelines with clean patterns</summary>

<br>

Framework for reproducible, maintainable ML pipelines with clean coding patterns.

```
  Score     68/100
  Stars     ⭐ 10,957 (+33 last 32d, +5 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   NOASSERTION
  Tags      mlops · hacktoberfest · pipeline · experiment-tracking · machine-learning-engineering
```

</details>

<details><summary>🟡 <b>16</b> <b><a href="https://github.com/aimhubio/aim">Aim</a></b> <code>⭐ 6.2K</code> <code>↗️ +40</code> <code>Apache-2.0</code> Self-hosted experiment tracker for 10,000+ training runs</summary>

<br>

Self-hosted experiment tracker with a high-performance UI that handles 10,000+ training runs. **Quiet - no commits for 6+ months.**

```
  Score     59/100
  Stars     ⭐ 6,239 (+40 last 32d, +8 last 7d)
  Activity  🟡 Dec 2025
  Release   📦 May 2025
  License   Apache-2.0
  Tags      mlops · prompt-engineering · tensorflow · data-visualization · visualization
```

</details>


**[⬆ Back to Contents](#contents)**

## Model Serving

*General-purpose model serving, packaging, and inference infrastructure for ML, DL, and multi-framework deployments.*

<details><summary>🟢 🥇 <b><a href="https://github.com/microsoft/onnxruntime">ONNX Runtime</a></b> <code>⭐ 21.4K</code> <code>↗️ +274</code> <code>MIT</code> Cross-platform inference accelerator via ONNX format</summary>

<br>

Cross-platform inference accelerator supporting PyTorch, TensorFlow, scikit-learn, and XGBoost via the ONNX format (Microsoft).

```
  Score     76/100
  Stars     ⭐ 21,415 (+274 last 32d, +41 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      tensorflow · scikit-learn · neural-networks · onnx
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/openvinotoolkit/openvino">OpenVINO</a></b> <code>⭐ 10.7K</code> <code>↗️ +139</code> <code>Apache-2.0</code> Intel inference optimization for CPU, GPU, and edge</summary>

<br>

Inference optimization and deployment toolkit for CPUs, GPUs, and edge accelerators (Intel).

```
  Score     73/100
  Stars     ⭐ 10,688 (+139 last 32d, +36 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      generative-ai · transformers · inference · nlp · llm-inference
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a></b> <code>⭐ 10.9K</code> <code>↗️ +74</code> <code>BSD-3-Clause</code> Multi-framework inference server for production deployment</summary>

<br>

Multi-framework inference serving for TensorRT, PyTorch, ONNX, and custom backends (NVIDIA).

```
  Score     72/100
  Stars     ⭐ 10,931 (+74 last 32d, +12 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jul 2026
  License   BSD-3-Clause
  Tags      inference · gpu
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/bentoml/BentoML">BentoML</a></b> <code>⭐ 8.8K</code> <code>↗️ +66</code> <code>Apache-2.0</code> Python framework for production inference APIs and pipelines</summary>

<br>

Build production-ready inference APIs, batch jobs, and multi-model pipelines with unified Python framework.

```
  Score     72/100
  Stars     ⭐ 8,794 (+66 last 32d, +6 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 May 2026
  License   Apache-2.0
  Tags      llmops · mlops · generative-ai · llm-inference · llm-serving
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/kserve/kserve">KServe</a></b> <code>⭐ 5.8K</code> <code>↗️ +103</code> <code>Apache-2.0</code> Kubernetes-native model serving with canary rollouts</summary>

<br>

Kubernetes-native standardized model serving with canary rollouts, autoscaling, and multi-framework support (CNCF Incubating).

```
  Score     72/100
  Stars     ⭐ 5,815 (+103 last 32d, +22 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      mlops · tensorflow · hacktoberfest · artificial-intelligence · llm-inference
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/replicate/cog">Cog</a></b> <code>⭐ 9.5K</code> <code>↗️ +15</code> <code>Apache-2.0</code> Package ML models as Docker containers with auto APIs</summary>

<br>

Package ML models as standard Docker containers with auto-generated HTTP APIs and GPU setup for reproducible, portable deployment (Replicate).

```
  Score     71/100
  Stars     ⭐ 9,459 (+15 last 32d, +2 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      tensorflow · cuda
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/pytorch/executorch">ExecuTorch</a></b> <code>⭐ 4.9K</code> <code>↗️ +129</code> <code>NOASSERTION</code> On-device AI inference with 50KB runtime footprint</summary>

<br>

On-device AI inference for mobile, embedded, and edge platforms with a 50KB base runtime footprint (Meta).

```
  Score     69/100
  Stars     ⭐ 4,940 (+129 last 32d, +25 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      neural-network · gpu
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/Lightning-AI/LitServe">LitServe</a></b> <code>⭐ 3.9K</code> <code>Apache-2.0</code> Minimal high-performance Python AI serving framework</summary>

<br>

Minimal, high-performance Python framework for AI model serving (Lightning AI).

```
  Score     67/100
  Stars     ⭐ 3,929 (+9 last 32d, +1 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      developer-tools · artificial-intelligence · serving · api · rest-api
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/tensorflow/tfx">TFX</a></b> <code>⭐ 2.2K</code> <code>Apache-2.0</code> End-to-end production ML pipeline platform from Google</summary>

<br>

End-to-end platform for deploying production ML pipelines with data validation, transformation, training, evaluation, and serving components (Google).

```
  Score     65/100
  Stars     ⭐ 2,190 (+2 last 32d, -1 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Jun 2026
  License   Apache-2.0
  Tags      tensorflow
```

</details>


**[⬆ Back to Contents](#contents)**

## LLM Inference Runtimes

*High-performance inference engines optimised specifically for serving large language models.*

<details><summary>🟢 🥇 <b><a href="https://github.com/ggml-org/llama.cpp">llama.cpp</a></b> <code>⭐ 125.0K</code> <code>↗️ +3952</code> <code>MIT</code> C/C++ LLM inference, foundation for local apps</summary>

<br>

LLM inference in C/C++ with broad hardware support - the foundation for most local LLM applications.

```
  Score     86/100
  Stars     ⭐ 124,960 (+3952 last 32d, +1064 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      ggml
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/ollama/ollama">Ollama</a></b> <code>⭐ 179.1K</code> <code>↗️ +2599</code> <code>MIT</code> Docker-like local LLM runner for fast prototyping</summary>

<br>

Docker-like local LLM runner for getting models up and running quickly for prototyping.

```
  Score     84/100
  Stars     ⭐ 179,090 (+2599 last 32d, +557 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      llms · llama · qwen · deepseek · gpt-oss
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/vllm-project/vllm">vLLM</a></b> <code>⭐ 89.6K</code> <code>↗️ +2929</code> <code>Apache-2.0</code> High-throughput PagedAttention engine for production LLMs</summary>

<br>

High-throughput LLM serving engine with PagedAttention, powering most open-source LLM deployments in production.

```
  Score     84/100
  Stars     ⭐ 89,612 (+2929 last 32d, +572 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      openai · inference · llama · gpt · qwen
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/sgl-project/sglang">SGLang</a></b> <code>⭐ 32.2K</code> <code>↗️ +1687</code> <code>Apache-2.0</code> High-performance LLM serving with constrained decoding</summary>

<br>

High-performance LLM serving framework powering 400K+ GPUs with best-in-class structured and constrained decoding.

```
  Score     84/100
  Stars     ⭐ 32,221 (+1687 last 32d, +432 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      inference · llama · reinforcement-learning · qwen · transformer
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/ml-explore/mlx-lm">MLX LM</a></b> <code>⭐ 6.7K</code> <code>MIT</code> LLM inference and tuning on Apple silicon</summary>

<br>

Runs and fine-tunes language models on Apple silicon via MLX, with quantization and unified-memory execution across the Mac line.

```
  Score     82/100
  Stars     ⭐ 6,727 (+123 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      llms · inference · quantization
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/llm-d/llm-d">llm-d</a></b> <code>⭐ 4.1K</code> <code>Apache-2.0</code> Kubernetes-native distributed LLM inference</summary>

<br>

Kubernetes-native distributed inference stack with prefix-cache-aware routing and disaggregated serving, built on vLLM and the Gateway API.

```
  Score     79/100
  Stars     ⭐ 4,088 (+60 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      inference · gpu · kubernetes · cncf
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/kvcache-ai/ktransformers">KTransformers</a></b> <code>⭐ 19.3K</code> <code>Apache-2.0</code> Heterogeneous GPU/CPU inference for MoE models</summary>

<br>

Heterogeneous inference framework that places experts across GPU and CPU, running large mixture-of-experts models on constrained hardware.

```
  Score     74/100
  Stars     ⭐ 19,264 (+30 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      inference · quantization · optimization
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a></b> <code>⭐ 14.4K</code> <code>↗️ +272</code> <code>NOASSERTION</code> NVIDIA's high-performance LLM inference with custom kernels</summary>

<br>

High-performance LLM inference library with custom attention kernels, speculative decoding, and MoE support (NVIDIA).

```
  Score     71/100
  Stars     ⭐ 14,433 (+272 last 32d, +51 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      cuda · llm-serving · moe · blackwell
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/InternLM/lmdeploy">LMDeploy</a></b> <code>⭐ 8.0K</code> <code>↗️ +47</code> <code>Apache-2.0</code> Compress, deploy, and serve LLMs and vision models</summary>

<br>

Toolkit for compressing, deploying, and serving large language and vision-language models.

```
  Score     71/100
  Stars     ⭐ 8,012 (+47 last 32d, +7 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llama · llm-inference
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/ai-dynamo/dynamo">NVIDIA Dynamo</a></b> <code>⭐ 7.8K</code> <code>NOASSERTION</code> Datacenter-scale disaggregated inference serving</summary>

<br>

Datacenter-scale distributed inference server with disaggregated prefill and decode, KV-cache-aware routing, and multi-backend support.

```
  Score     71/100
  Stars     ⭐ 7,817 (+54 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   NOASSERTION
  Tags      llm-inference · kubernetes · rust · vllm · sglang
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/ModelTC/LightLLM">LightLLM</a></b> <code>⭐ 4.2K</code> <code>↗️ +46</code> <code>Apache-2.0</code> Lightweight LLM serving with continuous batching</summary>

<br>

Lightweight LLM inference and serving framework with continuous batching, tensor parallelism, and efficient memory management.

```
  Score     70/100
  Stars     ⭐ 4,229 (+46 last 32d, +4 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   Apache-2.0
  Tags      llama · nlp · gpt · model-serving
```

</details>


**[⬆ Back to Contents](#contents)**

## Papers and Surveys

*Foundational surveys and recent papers on AutoML methods, agentic ML, and benchmarking.*

<details><summary>📄 <b><a href="https://arxiv.org/abs/1908.00709">AutoML: A Survey of the State-of-the-Art (2021)</a></b> Comprehensive survey of the full AutoML pipeline</summary>

<br>

Comprehensive survey covering the full AutoML pipeline including data preparation, feature engineering, HPO, and NAS with benchmark comparisons.

```
  Authors   He, X., Zhao, K., Chu, X.
  Venue     Knowledge-Based Systems
  Year      2021
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/1611.01578">Neural Architecture Search with Reinforcement Learning (2017)</a></b> Seminal RL-based NAS paper that launched the field</summary>

<br>

Seminal paper introducing NAS using an RNN controller trained with reinforcement learning to generate competitive architectures on CIFAR-10.

```
  Authors   Zoph, B., Le, Q. V.
  Venue     ICLR 2017
  Year      2017
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/1808.05377">Neural Architecture Search: A Survey (2019)</a></b> Canonical NAS survey with three-dimension taxonomy</summary>

<br>

Canonical NAS survey categorizing methods along three dimensions - search space, search strategy, and performance estimation strategy.

```
  Authors   Elsken, T., Metzen, J. H., Hutter, F.
  Venue     JMLR
  Year      2019
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2006.02903">A Comprehensive Survey of Neural Architecture Search: Challenges and Solutions (2021)</a></b> NAS survey across early RL to modern gradient methods</summary>

<br>

Survey reviewing NAS methods from earliest algorithms through modern gradient-based approaches with comparative analysis across datasets.

```
  Authors   Ren, P., Xiao, Y., Chang, X. et al.
  Venue     ACM Computing Surveys
  Year      2021
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2304.05405">Efficient Automation of Neural Network Design: A Survey on Differentiable NAS (2024)</a></b> Differentiable NAS survey with challenge-based taxonomy</summary>

<br>

Survey of differentiable NAS methods building on DARTS, proposing a challenge-based taxonomy for classifying DNAS techniques.

```
  Authors   Heuillet, A., Nasser, A., Arioui, H. et al.
  Venue     ACM Computing Surveys
  Year      2024
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2007.15745">On Hyperparameter Optimization of Machine Learning Algorithms (2020)</a></b> HPO survey covering theory, libraries, and benchmarks</summary>

<br>

Survey of state-of-the-art HPO techniques, libraries, and benchmark experiments comparing Bayesian, evolutionary, and bandit-based methods.

```
  Authors   Yang, L., Shami, A.
  Venue     Neurocomputing
  Year      2020
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2107.05847">Hyperparameter Optimization: Foundations, Algorithms, Best Practices (2023)</a></b> HPO foundations, best practices, and open challenges</summary>

<br>

In-depth review of HPO foundations including Bayesian optimization, Hyperband, racing, and practical guidance on integrating HPO with ML pipelines.

```
  Authors   Bischl, B., Binder, M., Lang, M. et al.
  Venue     WIREs DMKD
  Year      2023
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/1904.12054">Benchmark and Survey of Automated Machine Learning Frameworks (2021)</a></b> Combined AutoML survey and benchmark on 137 datasets</summary>

<br>

Combined survey and benchmark of AutoML techniques across the full ML pipeline evaluated on 137 datasets from established suites.

```
  Authors   Zoller, M.-A., Huber, M. F.
  Venue     JAIR
  Year      2021
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2207.12560">AMLB: an AutoML Benchmark (2024)</a></b> Open benchmark of 9 AutoML frameworks on 104 tasks</summary>

<br>

Open benchmark comparing 9 AutoML frameworks across 104 classification and regression tasks with multi-faceted accuracy and runtime analysis.

```
  Authors   Gijsbers, P., Bueno, M. L. P., Coors, S. et al.
  Venue     JMLR
  Year      2024
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2004.05439">Meta-Learning in Neural Networks: A Survey (2021)</a></b> Meta-learning survey with taxonomy and applications</summary>

<br>

Comprehensive meta-learning survey with a new taxonomy, relationships to transfer learning and HPO, and applications to few-shot learning.

```
  Authors   Hospedales, T., Antoniou, A., Micaelli, P. et al.
  Venue     IEEE TPAMI
  Year      2021
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2110.01889">Deep Neural Networks and Tabular Data: A Survey (2022)</a></b> Deep learning for tabular data survey and benchmarks</summary>

<br>

Survey of deep learning for tabular data categorizing data transformations, specialized architectures, and regularization approaches with empirical comparisons.

```
  Authors   Borisov, V., Leemann, T., Sesler, K. et al.
  Venue     IEEE TNNLS
  Year      2022
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2003.06505">AutoGluon-Tabular: Robust and Accurate AutoML for Structured Data (2020)</a></b> Multi-layer stacking ensembles for tabular AutoML</summary>

<br>

Technical paper introducing multi-layer stacking ensembles for tabular AutoML that outperformed TPOT, H2O, and AutoWEKA across 50 benchmarks.

```
  Authors   Erickson, N., Mueller, J., Shirkov, A. et al.
  Venue     AutoML Workshop ICML 2020
  Year      2020
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2207.01848">TabPFN: A Transformer That Solves Small Tabular Classification Problems in a Second (2023)</a></b> In-context transformer for small tabular classification</summary>

<br>

In-context-learning transformer for tabular classification matching AutoML systems on small datasets with up to 5700x GPU speedups.

```
  Authors   Hollmann, N., Muller, S., Eggensperger, K. et al.
  Venue     ICLR 2023
  Year      2023
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2308.05566">AutoGluon-TimeSeries: AutoML for Probabilistic Time Series Forecasting (2023)</a></b> AutoML for probabilistic time series forecasting</summary>

<br>

Open-source AutoML library for probabilistic time-series forecasting combining statistical, ML, and deep learning models via ensembling on 29 benchmarks.

```
  Authors   Shchur, O., Turkmen, C., Erickson, N. et al.
  Venue     AutoML Conference 2023
  Year      2023
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2403.07815">Chronos: Learning the Language of Time Series (2024)</a></b> Pretrained foundation models for time series</summary>

<br>

Pretrained probabilistic time-series foundation models tokenizing values for T5-based transformers achieving strong zero-shot forecasting across 42 datasets.

```
  Authors   Ansari, A. F., Stella, L., Turkmen, C. et al.
  Venue     TMLR
  Year      2024
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2108.07258">On the Opportunities and Risks of Foundation Models (2021)</a></b> Foundational report defining foundation models</summary>

<br>

Stanford CRFM report defining foundation models and analyzing their capabilities, technical principles, applications, and societal impact.

```
  Authors   Bommasani, R., Hudson, D. A., Adeli, E. et al.
  Venue     Stanford CRFM Report
  Year      2021
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2403.14608">Parameter-Efficient Fine-Tuning for Large Models: A Comprehensive Survey (2024)</a></b> Comprehensive PEFT survey for large models</summary>

<br>

Survey of PEFT methods for LLMs and vision models covering algorithms, computational overhead, applications, and real-world system design.

```
  Authors   Han, Z., Gao, C., Liu, J. et al.
  Venue     arXiv preprint
  Year      2024
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2309.07864">The Rise and Potential of Large Language Model Based Agents: A Survey (2025)</a></b> LLM agents survey with brain-perception-action framework</summary>

<br>

Comprehensive survey on LLM-based agents presenting a brain-perception-action framework with applications across single-agent, multi-agent, and agent societies.

```
  Authors   Xi, Z., Chen, W., Guo, X. et al.
  Venue     Science China Info Sciences
  Year      2025
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2308.11432">A Survey on Large Language Model based Autonomous Agents (2024)</a></b> Unified framework survey on LLM autonomous agents</summary>

<br>

Unified framework survey on LLM-based autonomous agents across social science, natural science, and engineering with evaluation strategies.

```
  Authors   Wang, L., Ma, C., Feng, X. et al.
  Venue     Frontiers of Computer Science
  Year      2024
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2410.02958">AutoML-Agent: A Multi-Agent LLM Framework for Full-Pipeline AutoML (2025)</a></b> Multi-agent LLM framework for full-pipeline AutoML</summary>

<br>

Multi-agent LLM framework spanning data retrieval to deployment using retrieval-augmented planning, parallel specialized agents, and multi-stage verification.

```
  Authors   Trirat, P., Jeong, W., Hwang, S. J.
  Venue     ICLR 2025
  Year      2025
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2310.03302">MLAgentBench: Evaluating Language Agents on Machine Learning Experimentation (2024)</a></b> Benchmark of 13 ML tasks evaluating LLM agents</summary>

<br>

Benchmark of 13 ML tasks evaluating LLM-driven agents across file I/O, code execution, and iterative ReAct-style experimentation.

```
  Authors   Huang, Q., Vora, J., Liang, P. et al.
  Venue     ICML 2024
  Year      2024
```

</details>

<details><summary>📄 <b><a href="https://arxiv.org/abs/2303.10158">Data-centric Artificial Intelligence: A Survey (2025)</a></b> Survey of data-centric AI across the data lifecycle</summary>

<br>

Survey of data-centric AI covering training data development, inference data development, and data maintenance with automation and collaboration views.

```
  Authors   Zha, D., Bhat, Z. P., Lai, K.-H. et al.
  Venue     ACM Computing Surveys
  Year      2025
```

</details>


**[⬆ Back to Contents](#contents)**

## Related Awesome Lists

*Complementary awesome lists covering adjacent ML / AI topics.*

<details><summary>🟢 🥇 <b><a href="https://github.com/josephmisiti/awesome-machine-learning">awesome-machine-learning</a></b> <code>⭐ 74.1K</code> <code>↗️ +485</code> <code>NOASSERTION</code> ML frameworks and libraries organized by language</summary>

<br>

Curated list of ML frameworks, libraries, and software organized by language.

```
  Score     74/100
  Stars     ⭐ 74,092 (+485 last 32d, +63 last 7d)
  Activity  🟢 Aug 2026
  License   NOASSERTION
  Tags      awesome · curated-list
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/EthicalML/awesome-production-machine-learning">awesome-production-machine-learning</a></b> <code>⭐ 20.9K</code> <code>↗️ +66</code> <code>MIT</code> Tools for deploying and scaling ML in production</summary>

<br>

Curated list of tools for deploying, monitoring, and scaling ML in production.

```
  Score     73/100
  Stars     ⭐ 20,858 (+66 last 32d, +17 last 7d)
  Activity  🟢 Aug 2026
  Release   📦 Aug 2026
  License   MIT
  Tags      mlops · awesome · data-mining · responsible-ai · ml-ops
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/steven2358/awesome-generative-ai">awesome-generative-ai</a></b> <code>⭐ 12.5K</code> <code>↗️ +164</code> <code>CC0-1.0</code> Modern generative AI projects and services curated</summary>

<br>

Curated list of modern generative AI projects and services.

```
  Score     73/100
  Stars     ⭐ 12,524 (+164 last 32d, +29 last 7d)
  Activity  🟢 Aug 2026
  License   CC0-1.0
  Tags      generative-ai · large-language-models · artificial-intelligence · awesome
```

</details>

<details><summary>🟡 <b>4</b> <b><a href="https://github.com/lukasmasuch/best-of-ml-python">best-of-ml-python</a></b> <code>⭐ 23.7K</code> <code>CC-BY-SA-4.0</code> Python ML libraries ranked by project quality</summary>

<br>

Ranked list of Python ML libraries scored on project quality across dozens of categories. **Quiet - minimal recent development.**

```
  Score     63/100
  Stars     ⭐ 23,727 (+15 last 7d)
  Activity  🟡 Mar 2026
  Release   📦 Nov 2025
  License   CC-BY-SA-4.0
  Tags      ml · tensorflow · nlp · scikit-learn · keras
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/kelvins/awesome-mlops">awesome-mlops</a></b> <code>⭐ 5.3K</code> MLOps tools organised by pipeline stage</summary>

<br>

Curated list of MLOps tools organised by pipeline stage.

```
  Score     62/100
  Stars     ⭐ 5,251 (+14 last 7d)
  Activity  🟢 Aug 2026
  License   -
  Tags      mlops · awesome · machine-learning-engineering
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/Hannibal046/Awesome-LLM">awesome-llm</a></i> <code>⭐ 27.3K</code> <code>CC0-1.0</code> LLM resources covering papers, tools, and applications</summary>

<br>

*Curated list of large language model resources covering papers, tools, and applications. **Kept as a reference index; see awesome-machine-learning for a maintained one.***

```
  Score     62/100
  Stars     ⭐ 27,275 (n/a)
  Activity  🔴 Jul 2025 - unmaintained 12+ months
  License   CC0-1.0
  Tags      large-language-models · nlp · awesome · curated-list
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/ChristosChristofidis/awesome-deep-learning">awesome-deep-learning</a></i> <code>⭐ 28.8K</code> Deep learning tutorials, projects, and communities</summary>

<br>

*Curated list of deep learning tutorials, projects, and communities. **Kept as a reference index; see awesome-machine-learning for a maintained one.***

```
  Score     54/100
  Stars     ⭐ 28,787 (n/a)
  Activity  🔴 May 2025 - unmaintained 12+ months
  License   -
  Tags      neural-network · awesome
```

</details>


**[⬆ Back to Contents](#contents)**

## Research Notes by Topic

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
- [MIT EfficientML.ai](https://hanlab.mit.edu/course) - Course on efficient ML and neural architecture search by Song Han at MIT.
- [AutoML.org](https://www.automl.org/) - Research portal and resources from the AutoML group at University of Freiburg and Leibniz University Hannover.

**[⬆ Back to Contents](#contents)**

## Conferences and Communities

- [AutoML Conference](https://automl.cc/) - Annual conference dedicated to AutoML research.
- [OpenML](https://www.openml.org/) - Open science platform for sharing ML experiments, datasets, tasks, and flows.
- [Hugging Face Papers](https://huggingface.co/papers) - Daily-curated ML papers with linked models, datasets, and demos. Successor to Papers With Code.
- [MLE-Bench Leaderboard](https://github.com/openai/mle-bench#leaderboard) - Public leaderboard for ML engineering agents competing on Kaggle tasks.

**[⬆ Back to Contents](#contents)**

## Contributing

Contributions welcome! Read the [contributing guidelines](CONTRIBUTING.md) first.
