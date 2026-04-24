<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/logo-dark.svg">
  <img alt="Awesome Automated AI/ML logo" src="docs/assets/logo.svg" width="180" height="180">
</picture>

# Awesome Automated AI/ML [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

A curated list of tools for Automated AI/ML - from hyperparameter optimization to autonomous AI agents.

[![Views](https://hits.sh/github.com/jbogocz/awesome-automated-ai.svg?style=flat-square&label=views&color=2f6feb)](https://hits.sh/github.com/jbogocz/awesome-automated-ai/)
[![GitHub stars](https://img.shields.io/github/stars/jbogocz/awesome-automated-ai?style=flat-square&color=2f6feb)](https://github.com/jbogocz/awesome-automated-ai/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/jbogocz/awesome-automated-ai?style=flat-square&color=2f6feb)](https://github.com/jbogocz/awesome-automated-ai/commits)
[![License: CC0 + MIT](https://img.shields.io/badge/license-CC0_+_MIT-2f6feb?style=flat-square)](LICENSE)
[![Tools](https://img.shields.io/badge/tools-250+-2f6feb?style=flat-square)](#contents)

</div>

<div align="center">

### **[> Explore interactively <](https://jbogocz.github.io/awesome-automated-ai)**

250+ entries across 25 categories in 7 sections

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

**Build AutoML**
- [General-Purpose AutoML](#general-purpose-automl) (23)
- [Neural Architecture Search](#neural-architecture-search) (6)
- [Hyperparameter Optimization](#hyperparameter-optimization) (10)
- [Automated Feature Engineering](#automated-feature-engineering) (8)
- [Tabular Foundation Models](#tabular-foundation-models) (8)
- [AutoML Benchmarks](#automl-benchmarks) (5)

**Build with LLMs**
- [Automated Fine-Tuning](#automated-fine-tuning) (13)
- [Automated Prompt Optimization](#automated-prompt-optimization) (9)

**Build Agents**
- [Agent Frameworks](#agent-frameworks) (13)
- [Coding Agents](#coding-agents) (14)
- [ML and Research Agents](#ml-and-research-agents) (13)

**Evaluate & Monitor AI**
- [LLM Evaluation and Testing](#llm-evaluation-and-testing) (13)
- [LLM Routing and Selection](#llm-routing-and-selection) (5)
- [Automated Monitoring and Observability](#automated-monitoring-and-observability) (8)
- [Automated AI Safety](#automated-ai-safety) (6)

**ML Lifecycle**
- [Time-Series AutoML](#time-series-automl) (15)
- [Automated Data Preprocessing](#automated-data-preprocessing) (9)
- [Automated Data Labeling](#automated-data-labeling) (9)
- [Synthetic Data Generation](#synthetic-data-generation) (6)
- [Automated Model Compression](#automated-model-compression) (9)
- [MLOps and Experiment Tracking](#mlops-and-experiment-tracking) (16)

**Deploy AI**
- [Model Serving](#model-serving) (9)
- [LLM Inference Runtimes](#llm-inference-runtimes) (7)

**Research & Reference**
- [Papers and Surveys](#papers-and-surveys) (22)
- [Related Awesome Lists](#related-awesome-lists) (6)

**Resources**
- [Research Notes by Topic](#research-notes-by-topic)
- [Books and Courses](#books-and-courses) (3)
- [Conferences and Communities](#conferences-and-communities) (4)

### Legend

| Symbol | Meaning |
|:-------|:--------|
| :green_circle: :yellow_circle: :red_circle: | Project health: active (< 6 months) / stale (6-12 months) / unmaintained (> 12 months) |
| **88** | Quality score (0-100): stars 50%, trend 25%, freshness 15%, license 10%; archived repos score 0 |
| :1st_place_medal: :2nd_place_medal: :3rd_place_medal: | Top 3 quality score per category |
| :star: 11.7K | GitHub stars |
| :arrow_upper_right: +340 | Stars gained in last 30 days (shown when >= 10) |
| :zzz: | Unmaintained - no activity for 12+ months |
| :file_cabinet: | Historical - included for foundational influence |
| :office: | Commercial enterprise platform (vendor product) |
| `Apache-2.0` | SPDX license identifier |

> Click any project to expand its full dashboard with quality bar, exact stats, and tags.

## General-Purpose AutoML

*End-to-end frameworks that automate model selection, hyperparameter tuning, and pipeline construction. Covers both open-source libraries and enterprise commercial platforms.*

<details><summary>🟢 🥇 <b><a href="https://github.com/autogluon/autogluon">AutoGluon</a></b> <code>⭐ 10.3K</code> <code>↗️ +124</code> <code>Apache-2.0</code> Multi-modal stack ensembling, Kaggle champion</summary>

<br>

Multi-layer stack ensembling for tabular, text, image, time-series, and multimodal data - won medals in 15/18 Kaggle tabular contests in 2024 (Amazon).

```
  Score     73/100
  Stars     ⭐ 10,259 (+124 last 30d, +28 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      autogluon · automated-machine-learning · automl · computer-vision · data-science
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/ludwig-ai/ludwig">Ludwig</a></b> <code>⭐ 11.7K</code> <code>↗️ +22</code> <code>Apache-2.0</code> Declarative deep learning via YAML configs</summary>

<br>

Declarative deep learning framework supporting custom model building and LLM fine-tuning via YAML configs. Now under Linux Foundation AI & Data.

```
  Score     71/100
  Stars     ⭐ 11,676 (+22 last 30d, +4 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      computer-vision · data-centric · data-science · deep · deep-learning
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/pycaret/pycaret">PyCaret</a></b> <code>⭐ 9.7K</code> <code>↗️ +32</code> <code>MIT</code> Low-code AutoML from training to deployment</summary>

<br>

Low-code machine learning library that automates model training, tuning, and deployment workflows in Python.

```
  Score     71/100
  Stars     ⭐ 9,748 (+32 last 30d, +4 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2024
  License   MIT
  Tags      anomaly-detection · citizen-data-scientists · classification · clustering · data-science
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/automl/auto-sklearn">auto-sklearn</a></b> <code>⭐ 8.1K</code> <code>↗️ +13</code> <code>BSD-3-Clause</code> Bayesian optimization and meta-learning AutoML</summary>

<br>

Historically important AutoML toolkit using Bayesian optimization, meta-learning, and ensemble construction. **Low activity; no major releases since 2022.**

```
  Score     70/100
  Stars     ⭐ 8,085 (+13 last 30d, +4 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Feb 2023
  License   BSD-3-Clause
  Tags      automated-machine-learning · automl · bayesian-optimization · hyperparameter-optimization · hyperparameter-search
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/h2oai/h2o-3">H2O AutoML</a></b> <code>⭐ 7.5K</code> <code>Apache-2.0</code> Enterprise distributed AutoML with time limits</summary>

<br>

Distributed machine learning platform with automatic training and tuning of many models within a user-specified time limit.

```
  Score     70/100
  Stars     ⭐ 7,485 (+9 last 30d, -10 last 7d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      automl · big-data · data-science · deep-learning · distributed
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/microsoft/FLAML">FLAML</a></b> <code>⭐ 4.3K</code> <code>↗️ +30</code> <code>MIT</code> Fast AutoML with minimal compute resources</summary>

<br>

Fast and lightweight AutoML that finds good models with minimal resources - often the best choice for resource-constrained environments (Microsoft).

```
  Score     69/100
  Stars     ⭐ 4,339 (+30 last 30d, +7 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Jan 2026
  License   MIT
  Tags      automated-machine-learning · automl · classification · data-science · deep-learning
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/shankarpandala/lazypredict">LazyPredict</a></b> <code>⭐ 3.3K</code> <code>↗️ +12</code> <code>MIT</code> Dozens of sklearn models in one line</summary>

<br>

Build and evaluate dozens of scikit-learn models in a single line of code for rapid baseline comparison.

```
  Score     67/100
  Stars     ⭐ 3,315 (+12 last 30d, +3 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      automl · classification · machine-learning · regression
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/mljar/mljar-supervised">MLJAR Supervised</a></b> <code>⭐ 3.3K</code> <code>MIT</code> AutoML with per-model reports and explanations</summary>

<br>

Automated ML with automatic explanations, visualizations, and Markdown reports for every trained model.

```
  Score     65/100
  Stars     ⭐ 3,250 (+3 last 30d, 0 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      automated-machine-learning · automl · automl-api · automl-python · catboost
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/keras-team/autokeras">AutoKeras</a></b> <code>⭐ 9.3K</code> <code>↗️ +10</code> <code>Apache-2.0</code> Neural architecture search built on Keras</summary>

<br>

Neural architecture search for deep learning models built on top of Keras.

```
  Score     62/100
  Stars     ⭐ 9,313 (+10 last 30d, -2 last 7d)
  Activity  🟢 Nov 2025
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      autodl · automated-machine-learning · automl · deep-learning · keras
```

</details>

<details><summary>🟡 <b>10</b> <b><a href="https://github.com/EpistasisLab/tpot">TPOT</a></b> <code>⭐ 10.0K</code> <code>↗️ +12</code> <code>LGPL-3.0</code> Genetic programming pipeline optimizer for sklearn</summary>

<br>

Genetic programming-based pipeline optimizer that designs and optimizes scikit-learn pipelines.

```
  Score     59/100
  Stars     ⭐ 10,046 (+12 last 30d, +4 last 7d)
  Activity  🟡 Sep 2025
  Release   📦 Jul 2025
  License   LGPL-3.0
  Tags      adsp · ag066833 · aiml · alzheimer · alzheimers
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/sb-ai-lab/LightAutoML">LightAutoML</a></b> <code>⭐ 1.5K</code> <code>Apache-2.0</code> Fast customizable AutoML with Kaggle wins</summary>

<br>

Fast and customizable AutoML framework with Kaggle-winning performance (Sber AI Lab).

```
  Score     58/100
  Stars     ⭐ 1,458 (+8 last 30d, 0 last 7d)
  Activity  🟢 Jan 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      automated-machine-learning · automatic-machine-learning · automl · automl-algorithms · binary-classification
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/sapientml/sapientml">SapientML</a></b> <code>⭐ 449</code> <code>Apache-2.0</code> Generative AutoML from corpus of ML solutions</summary>

<br>

Generative AutoML that synthesizes pipelines by learning from a corpus of existing ML solutions.

```
  Score     58/100
  Stars     ⭐ 449 (+2 last 30d, 0 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      automated-machine-learning · automl · automl-products · automl-python · machine-learning
```

</details>

<details><summary>🟢 <b>13</b> <b><a href="https://github.com/alteryx/evalml">EvalML</a></b> <code>⭐ 846</code> <code>BSD-3-Clause</code> AutoML pipelines with domain-specific objectives</summary>

<br>

AutoML library for building, optimizing, and evaluating ML pipelines with domain-specific objectives (Alteryx).

```
  Score     56/100
  Stars     ⭐ 846 (+2 last 30d, -1 last 7d)
  Activity  🟢 Jan 2026
  Release   📦 Jun 2024
  License   BSD-3-Clause
  Tags      automl · data-science · feature-engineering · feature-selection · hyperparameter-tuning
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/amore-labs/gama">GAMA</a></i> <code>⭐ 103</code> <code>Apache-2.0</code> Genetic programming and Bayesian pipeline optimization</summary>

<br>

*AutoML tool that generates optimized ML pipelines using genetic programming and Bayesian optimization (OpenML). **Unmaintained - no commits for 12+ months.***

```
  Score     40/100
  Stars     ⭐ 103 (n/a)
  Activity  🔴 Sep 2024 - unmaintained 12+ months
  Release   📦 Jun 2024
  License   Apache-2.0
  Tags      automl · hyperparameter-optimization · research-tool
```

</details>

<details><summary>🔴 🗄️ <i><a href="https://github.com/automl/autoweka">Auto-WEKA</a></i> <code>⭐ 336</code> Original AutoML combining algorithm selection and HPO</summary>

<br>

*The original AutoML system (2013) combining algorithm selection and HPO in WEKA. **Historical; Java-only, no commits since 2022.***

```
  Score     36/100
  Stars     ⭐ 336 (n/a)
  Activity  🔴 Mar 2022 - historical
  Release   📦 Mar 2022
  License   -
  Tags      automl · bayesian-optimization · hyperparameter-optimization · java · machine-learning
```

</details>

---

<details><summary>🏢 <b><a href="https://cloud.google.com/vertex-ai">Vertex AI AutoML</a></b> Managed AutoML across data types on Google Cloud</summary>

<br>

Google Cloud's managed AutoML service for training tabular classification, regression, forecasting, image, and video models with one-click endpoint deployment.

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

<details><summary>🏢 <b><a href="https://www.dataiku.com/product/key-capabilities/machine-learning/automl/">Dataiku Visual ML</a></b> Visual AutoML inside the Dataiku data platform</summary>

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

<details><summary>🟢 🥇 <b><a href="https://github.com/microsoft/archai">Archai</a></b> <code>⭐ 485</code> <code>MIT</code> Modular NAS framework for reproducible research</summary>

<br>

Modular NAS framework for reproducible architecture search research (Microsoft).

```
  Score     52/100
  Stars     ⭐ 485 (+3 last 30d, +1 last 7d)
  Activity  🟢 Nov 2025
  Release   📦 Sep 2023
  License   MIT
  Tags      automated-machine-learning · automl · darts · deep-learning · hyperparameter-optimization
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/google/automl">Google AutoML</a></i> <code>⭐ 6.5K</code> <code>Apache-2.0</code> Research code behind EfficientNet and EfficientDet</summary>

<br>

*Research code for EfficientNet, EfficientDet, MnasNet, and other NAS-discovered architectures (Google Brain). **Research code; sporadic updates.***

```
  Score     56/100
  Stars     ⭐ 6,468 (n/a)
  Activity  🔴 Mar 2025 - unmaintained 12+ months
  Release   📦 Mar 2021
  License   Apache-2.0
  Tags      automl · efficientdet · efficientnet · efficientnetv2 · object-detection
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/automl/Auto-PyTorch">AutoPyTorch</a></i> <code>⭐ 2.5K</code> <code>Apache-2.0</code> Joint NAS and HPO for PyTorch from Auto-sklearn team</summary>

<br>

*Joint NAS and HPO for PyTorch from the AutoML Freiburg group behind auto-sklearn, combining BOHB with meta-learning and portfolio selection. **Low activity since Apr 2024.***

```
  Score     51/100
  Stars     ⭐ 2,536 (n/a)
  Activity  🔴 Apr 2024 - unmaintained 12+ months
  Release   📦 Aug 2022
  License   Apache-2.0
  Tags      automated-machine-learning · automl · deep-learning · hyperparameter-optimization · neural-architecture-search
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/mit-han-lab/tinyengine">TinyEngine</a></i> <code>⭐ 939</code> <code>MIT</code> Inference engine for NAS models on microcontrollers</summary>

<br>

*Memory-efficient inference engine for NAS-optimized models on microcontrollers (MIT HAN Lab). **Unmaintained - no commits for 12+ months.***

```
  Score     50/100
  Stars     ⭐ 939 (n/a)
  Activity  🔴 Nov 2024 - unmaintained 12+ months
  License   MIT
  Tags      c · codegenerator · cpp · deep-learning · edge-computing
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/automl/NASLib">NASLib</a></i> <code>⭐ 587</code> <code>Apache-2.0</code> NAS research library with standardized search spaces</summary>

<br>

*NAS research library from AutoML Freiburg with interfaces to state-of-the-art search spaces and optimizers. **Unmaintained - no commits for 12+ months.***

```
  Score     47/100
  Stars     ⭐ 587 (n/a)
  Activity  🔴 Nov 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      automl · nas · neural-architecture-search
```

</details>

<details><summary>🔴 💤 <i><a href="https://github.com/microsoft/nni">NNI</a></i> <code>⭐ 14.3K</code> <code>MIT</code> Comprehensive NAS, HPO, and model compression toolkit</summary>

<br>

*Comprehensive AutoML toolkit for NAS, hyperparameter tuning, feature engineering, and model compression. **Archived by Microsoft in Sep 2024.***

```
  Score     0/100
  Stars     ⭐ 14,347 (n/a)
  Activity  🔴 Jul 2024 - archived
  Release   📦 Sep 2023
  License   MIT
  Tags      automated-machine-learning · automl · bayesian-optimization · data-science · deep-learning
```

</details>


**[⬆ Back to Contents](#contents)**

## Hyperparameter Optimization

*Libraries dedicated to finding optimal hyperparameters via Bayesian optimization, bandits, evolutionary search, or population-based training.*

<details><summary>🟢 🥇 <b><a href="https://docs.ray.io/en/latest/tune/">Ray Tune</a></b> <code>⭐ 42.3K</code> <code>↗️ +555</code> <code>Apache-2.0</code> Distributed HPO at scale for any ML framework</summary>

<br>

Distributed hyperparameter tuning at scale with support for any ML framework and many search algorithms.

```
  Score     78/100
  Stars     ⭐ 42,295 (+555 last 30d, +116 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      distributed · hyperparameter-optimization · hyperparameter-search · machine-learning · optimization
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/optuna/optuna">Optuna</a></b> <code>⭐ 14.0K</code> <code>↗️ +296</code> <code>MIT</code> Most widely adopted HPO framework with pruning</summary>

<br>

Define-by-run API with pruning, distributed execution, and a dashboard - the most widely adopted HPO framework.

```
  Score     76/100
  Stars     ⭐ 14,038 (+296 last 30d, +50 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      distributed · hyperparameter-optimization · machine-learning · parallel · python
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/meta-pytorch/botorch">BoTorch</a></b> <code>⭐ 3.5K</code> <code>↗️ +24</code> <code>MIT</code> PyTorch Bayesian optimization for multi-objective problems</summary>

<br>

Bayesian optimization library in PyTorch for high-dimensional, noisy, and multi-objective problems (Meta).

```
  Score     68/100
  Stars     ⭐ 3,509 (+24 last 30d, +5 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      bayesian-optimization · deep-learning · gaussian-processes · hyperparameter-optimization · meta
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/facebook/Ax">Ax</a></b> <code>⭐ 2.7K</code> <code>↗️ +13</code> <code>MIT</code> Adaptive experimentation for multi-objective optimization</summary>

<br>

Adaptive experimentation platform for multi-objective optimization with BoTorch integration (Meta).

```
  Score     67/100
  Stars     ⭐ 2,739 (+13 last 30d, +3 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      bayesian-optimization · experimentation · facebook · hyperparameter-optimization · machine-learning
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/facebookresearch/nevergrad">Nevergrad</a></b> <code>⭐ 4.2K</code> <code>↗️ +18</code> <code>MIT</code> Gradient-free optimization with CMA-ES and evolution</summary>

<br>

Gradient-free optimization toolbox with CMA-ES, differential evolution, and particle swarm - Meta's canonical library for black-box and evolutionary optimization.

```
  Score     66/100
  Stars     ⭐ 4,183 (+18 last 30d, +10 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Apr 2025
  License   MIT
  Tags      bayesian-optimization · blackbox-optimization · evolutionary-algorithms · gradient-free-optimization · hyperparameter-optimization
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/kubeflow/katib">Katib</a></b> <code>⭐ 1.7K</code> <code>Apache-2.0</code> Kubernetes-native HPO and NAS for Kubeflow</summary>

<br>

Kubernetes-native hyperparameter tuning and NAS with pluggable algorithms and parallel trials - the HPO layer of Kubeflow.

```
  Score     64/100
  Stars     ⭐ 1,679 (+9 last 30d, 0 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Oct 2025
  License   Apache-2.0
  Tags      hyperparameter-optimization · katib · kubeflow · kubernetes · machine-learning
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/hyperopt/hyperopt">Hyperopt</a></b> <code>⭐ 7.6K</code> <code>↗️ +11</code> <code>NOASSERTION</code> Pioneer of tree-structured Parzen estimators for HPO</summary>

<br>

Pioneered tree-structured Parzen estimators for HPO. **Maintenance-only since 2021 - Optuna is successor.**

```
  Score     63/100
  Stars     ⭐ 7,588 (+11 last 30d, -3 last 7d)
  Activity  🟢 Mar 2026
  License   NOASSERTION
  Tags      hacktoberfest
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/automl/SMAC3">SMAC3</a></b> <code>⭐ 1.2K</code> <code>NOASSERTION</code> Bayesian HPO with racing mechanisms for algorithm configuration</summary>

<br>

Sequential model-based algorithm configuration combining Bayesian optimization with racing mechanisms (AutoML Freiburg).

```
  Score     60/100
  Stars     ⭐ 1,220 (+4 last 30d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      algorithm-configuration · automated-machine-learning · automl · bayesian-optimisation · bayesian-optimization
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/google/vizier">Google Vizier</a></b> <code>⭐ 1.6K</code> <code>Apache-2.0</code> Open-source interface to Google's internal HPO service</summary>

<br>

Research interface for blackbox and hyperparameter optimization with Bayesian, evolutionary, and multi-objective algorithms based on Google's internal Vizier Service.

```
  Score     60/100
  Stars     ⭐ 1,638 (+5 last 30d, -1 last 7d)
  Activity  🟢 Feb 2026
  Release   📦 Feb 2025
  License   Apache-2.0
  Tags      algorithm · bayesian-optimization · blackbox-optimization · deep-learning · distributed-computing
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/keras-team/keras-tuner">Keras Tuner</a></b> <code>⭐ 2.9K</code> <code>Apache-2.0</code> Hyperparameter search for Keras with Bayesian and Hyperband</summary>

<br>

Hyperparameter search for Keras models with built-in Bayesian optimization and Hyperband.

```
  Score     58/100
  Stars     ⭐ 2,924 (+5 last 30d, -1 last 7d)
  Activity  🟢 Dec 2025
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      automl · deep-learning · hyperparameter-optimization · keras · machine-learning
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Feature Engineering

*Tools that generate, select, and transform features without manual hand-crafting, including LLM-driven feature synthesis for tabular data.*

<details><summary>🟢 🥇 <b><a href="https://github.com/alteryx/featuretools">Featuretools</a></b> <code>⭐ 7.6K</code> <code>↗️ +11</code> <code>BSD-3-Clause</code> Deep feature synthesis for relational and temporal data</summary>

<br>

Deep feature synthesis for automatically creating meaningful features from relational and temporal data (Alteryx).

```
  Score     65/100
  Stars     ⭐ 7,632 (+11 last 30d, +4 last 7d)
  Activity  🟢 Feb 2026
  Release   📦 May 2024
  License   BSD-3-Clause
  Tags      automated-feature-engineering · automated-machine-learning · automl · data-science · feature-engineering
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/4paradigm/OpenMLDB">OpenMLDB</a></b> <code>⭐ 1.7K</code> <code>Apache-2.0</code> SQL-based feature engineering consistent across train and serve</summary>

<br>

Database for consistent feature computation between training and serving with SQL-based feature engineering (SIGMOD 2025).

```
  Score     64/100
  Stars     ⭐ 1,683 (+4 last 30d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Feb 2025
  License   Apache-2.0
  Tags      database-for-ai · database-for-machine-learning · feature-engineering · feature-extraction · feature-store
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/feature-engine/feature_engine">Feature-engine</a></b> <code>⭐ 2.2K</code> <code>↗️ +15</code> <code>BSD-3-Clause</code> Sklearn transformers for feature creation and selection</summary>

<br>

Scikit-learn-compatible transformers for feature creation, selection, encoding, and imputation.

```
  Score     64/100
  Stars     ⭐ 2,231 (+15 last 30d, +4 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Jan 2022
  License   BSD-3-Clause
  Tags      data-science · feature-engineering · feature-extraction · feature-selection · machine-learning
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/blue-yonder/tsfresh">tsfresh</a></b> <code>⭐ 9.2K</code> <code>↗️ +26</code> <code>MIT</code> Auto-extract hundreds of time-series features with filtering</summary>

<br>

Automatic extraction of hundreds of time-series features with built-in statistical relevance filtering.

```
  Score     62/100
  Stars     ⭐ 9,176 (+26 last 30d, +2 last 7d)
  Activity  🟢 Nov 2025
  Release   📦 Aug 2025
  License   MIT
  Tags      data-science · feature-extraction · time-series
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a></b> <code>⭐ 1.1K</code> <code>Apache-2.0</code> GPU-accelerated feature engineering for terabyte tabular data</summary>

<br>

GPU-accelerated feature engineering and preprocessing for terabyte-scale tabular data with automatic hashing, categorification, and normalization (NVIDIA).

```
  Score     60/100
  Stars     ⭐ 1,143 (+4 last 30d, 0 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Aug 2023
  License   Apache-2.0
  Tags      deep-learning · feature-engineering · feature-selection · gpu · machine-learning
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/scikit-learn-contrib/boruta_py">Boruta</a></b> <code>⭐ 1.6K</code> <code>BSD-3-Clause</code> All-relevant feature selection via random forest shadows</summary>

<br>

All-relevant feature selection wrapper using random forest shadow features to identify important predictors.

```
  Score     56/100
  Stars     ⭐ 1,623 (+4 last 30d, +1 last 7d)
  Activity  🟢 Nov 2025
  Release   📦 Aug 2024
  License   BSD-3-Clause
  Tags      feature-engineering · feature-selection · machine-learning · python · random-forest
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/cod3licious/autofeat">AutoFeat</a></b> <code>⭐ 536</code> <code>MIT</code> Sklearn-compatible non-linear feature generation and selection</summary>

<br>

Scikit-learn-compatible automated feature engineering and selection that generates non-linear features and selects robust subsets.

```
  Score     53/100
  Stars     ⭐ 536 (0 last 30d, -1 last 7d)
  Activity  🟢 Jan 2026
  License   MIT
  Tags      automated-data-science · automated-feature-engineering · automated-machine-learning · automl · feature-engineering
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/noahho/CAAFE">CAAFE</a></i> <code>⭐ 188</code> <code>NOASSERTION</code> LLM generates semantically meaningful features with explanations</summary>

<br>

*LLM-powered context-aware feature engineering that generates semantically meaningful features with explanations. **Unmaintained - no commits for 12+ months.***

```
  Score     42/100
  Stars     ⭐ 188 (n/a)
  Activity  🔴 Dec 2024 - unmaintained 12+ months
  License   NOASSERTION
  Tags      automl · data-science · deep-learning · feature-engineering · machine-learning
```

</details>


**[⬆ Back to Contents](#contents)**

## Tabular Foundation Models

*Pretrained models that replace traditional tabular AutoML pipelines with a single forward pass or zero-shot inference on structured data.*

<details><summary>🟢 🥇 <b><a href="https://github.com/PriorLabs/TabPFN">TabPFN</a></b> <code>⭐ 6.2K</code> <code>↗️ +231</code> <code>NOASSERTION</code> Beats tuned XGBoost in 2.8 seconds flat</summary>

<br>

Tabular foundation model that matches tuned XGBoost in 2.8 seconds with a single forward pass - 100% win rate vs default XGBoost on datasets under 10K rows (Nature 2024, now v2.6 supporting up to 100K rows).

```
  Score     72/100
  Stars     ⭐ 6,152 (+231 last 30d, +51 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      data-science · foundation-models · machine-learning · tabpfn · tabular-data
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/soda-inria/tabicl">TabICL</a></b> <code>⭐ 787</code> <code>↗️ +126</code> <code>NOASSERTION</code> Tabular foundation model 10x faster than TabPFN</summary>

<br>

State-of-the-art tabular foundation model achieving 10x faster inference than TabPFN v2.5 (ICML 2025).

```
  Score     70/100
  Stars     ⭐ 787 (+126 last 30d, +24 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      deep-learning · foundation-models · machine-learning · tabular-data · tabular-methods
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/LAMDA-Tabular/TALENT">TALENT</a></b> <code>⭐ 842</code> <code>↗️ +14</code> <code>MIT</code> Benchmark toolkit for 35+ tabular deep methods</summary>

<br>

Comprehensive toolkit and benchmark for tabular learning covering 35+ deep methods across 300 datasets.

```
  Score     64/100
  Stars     ⭐ 842 (+14 last 30d, +2 last 7d)
  Activity  🟢 Apr 2026
  License   MIT
  Tags      tabular · tabular-data · tabular-data-benchmark · tabular-data-deep-learning · tabular-data-machine-learning
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/limix-ldm-ai/LimiX">LimiX</a></b> <code>⭐ 3.4K</code> <code>↗️ +23</code> <code>Apache-2.0</code> Joint variable + missingness modeling with LDM scaling laws</summary>

<br>

Structured-data foundation model that jointly models variables and missingness via a Latent Distribution Model, introducing LDM scaling laws for tabular data.

```
  Score     64/100
  Stars     ⭐ 3,380 (+23 last 30d, +3 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      foundation-models · machine-learning · structured-data · tabular-data
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/yandex-research/tabm">TabM</a></b> <code>⭐ 1.0K</code> <code>↗️ +26</code> <code>Apache-2.0</code> Efficient MLP ensemble for top tabular performance</summary>

<br>

Parameter-efficient ensemble of MLPs based on BatchEnsemble, achieving top performance among tabular deep learning models without attention complexity (ICLR 2025, Yandex).

```
  Score     58/100
  Stars     ⭐ 1,011 (+26 last 30d, +14 last 7d)
  Activity  🟢 Nov 2025
  Release   📦 Aug 2025
  License   Apache-2.0
  Tags      deep-learning · ensembling · machine-learning · neural-networks · python
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/SAP-samples/sap-rpt-1-oss">ConTextTab</a></b> <code>⭐ 161</code> <code>Apache-2.0</code> Semantics-aware ICL trained on real tables</summary>

<br>

Semantics-aware tabular in-context learner (SAP-RPT-1) trained on real-world tabular data rather than purely synthetic priors.

```
  Score     54/100
  Stars     ⭐ 161 (+6 last 30d, 0 last 7d)
  Activity  🟢 Nov 2025
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      deep-learning · foundation-models · in-context-learning · tabular-data
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/layer6ai-labs/TabDPT-inference">TabDPT</a></b> <code>⭐ 79</code> <code>Apache-2.0</code> Scaling tabular foundation models on real data</summary>

<br>

Scales tabular foundation models via pretraining on real data; inference code from "TabDPT, Scaling Tabular Foundation Models on Real Data" (Layer 6 AI).

```
  Score     53/100
  Stars     ⭐ 79 (+1 last 30d, 0 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      deep-learning · foundation-models · machine-learning · pretraining · tabular-data
```

</details>

<details><summary>🟡 <b>8</b> <b><a href="https://github.com/soda-inria/carte">CARTE</a></b> <code>⭐ 170</code> <code>BSD-3-Clause</code> LLM-powered representation for heterogeneous tabular data</summary>

<br>

Context-aware tabular representation using pretrained language models for data with heterogeneous columns.

```
  Score     48/100
  Stars     ⭐ 170 (+3 last 30d, 0 last 7d)
  Activity  🟡 Aug 2025
  License   BSD-3-Clause
  Tags      classification · data-science · graph-transformer · machine-learning · regression
```

</details>


**[⬆ Back to Contents](#contents)**

## AutoML Benchmarks

*Standardised benchmarks and evaluation harnesses for comparing AutoML systems and ML agents across tasks and datasets.*

<details><summary>🟢 🥇 <b><a href="https://github.com/openai/mle-bench">MLE-Bench</a></b> <code>⭐ 1.5K</code> <code>↗️ +84</code> <code>NOASSERTION</code> 75 Kaggle competitions for evaluating ML agents</summary>

<br>

Benchmark using 75 Kaggle competitions to evaluate ML engineering agents (OpenAI).

```
  Score     70/100
  Stars     ⭐ 1,496 (+84 last 30d, +23 last 7d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      agents · automl-benchmark · benchmark · evaluation · kaggle
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/autogluon/tabarena">TabArena</a></b> <code>⭐ 212</code> <code>Apache-2.0</code> Living leaderboard for tabular ML best practices</summary>

<br>

Living benchmark for tabular ML with continuously maintained leaderboard and best-practice evaluation (NeurIPS 2025 Spotlight).

```
  Score     64/100
  Stars     ⭐ 212 (+9 last 30d, 0 last 7d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      autogluon · automl · benchmark · machine-learning · python
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/openml/automlbenchmark">AMLB</a></b> <code>⭐ 459</code> <code>MIT</code> Standard benchmark comparing AutoML frameworks across 104 tasks</summary>

<br>

Standard AutoML benchmark comparing frameworks across 104 classification and regression tasks (OpenML).

```
  Score     61/100
  Stars     ⭐ 459 (+4 last 30d, 0 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Sep 2023
  License   MIT
  Tags      automl · benchmark · machine-learning
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/D-X-Y/NAS-Bench-201">NAS-Bench-201</a></b> <code>⭐ 644</code> <code>MIT</code> 15,625 architectures across three datasets for fair NAS</summary>

<br>

Reproducible benchmark with 15,625 evaluated architectures across three datasets for fair NAS comparison.

```
  Score     52/100
  Stars     ⭐ 644 (+1 last 30d, +1 last 7d)
  Activity  🟢 Oct 2025
  License   MIT
  Tags      automl · dataset · nas · nas-bench-201 · pytorch
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/google-research/nasbench">NAS-Bench-101</a></i> <code>⭐ 714</code> <code>Apache-2.0</code> 423,624 evaluated neural architectures for NAS research</summary>

<br>

*Benchmark dataset with 423,624 evaluated neural architectures for efficient NAS research (Google). **Archived; reference benchmark, use NAS-Bench-201 for new work.***

```
  Score     0/100
  Stars     ⭐ 714 (n/a)
  Activity  🔴 May 2023 - archived
  License   Apache-2.0
  Tags      automl · benchmark · dataset · deep-learning · google
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Fine-Tuning

*Tools that automate adapting large language models to specific tasks and domains via SFT, LoRA, QLoRA, DPO, RLHF, and related methods.*

<details><summary>🟢 🥇 <b><a href="https://github.com/unslothai/unsloth">Unsloth</a></b> <code>⭐ 62.9K</code> <code>↗️ +4859</code> <code>Apache-2.0</code> Fine-tune LLMs 2-5x faster, 80% less memory</summary>

<br>

Fine-tune LLMs 2-5x faster with 80% less memory on a single GPU through optimized kernels and custom autograd.

```
  Score     90/100
  Stars     ⭐ 62,861 (+4859 last 30d, +869 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent · deepseek · fine-tuning · gemma · gemma3
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/hiyouga/LlamaFactory">LLaMA-Factory</a></b> <code>⭐ 70.6K</code> <code>↗️ +1663</code> <code>Apache-2.0</code> Unified fine-tuning for 100+ LLMs with web UI</summary>

<br>

Unified fine-tuning framework for 100+ LLMs and VLMs with Full, LoRA, QLoRA, and DoRA methods plus web UI (ACL 2024).

```
  Score     82/100
  Stars     ⭐ 70,567 (+1663 last 30d, +336 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      agent · ai · deepseek · fine-tuning · gemma
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/huggingface/lerobot">LeRobot</a></b> <code>⭐ 23.5K</code> <code>↗️ +911</code> <code>Apache-2.0</code> End-to-end learning for robotics</summary>

<br>

Hugging Face's end-to-end library for robotics learning with pretrained policies, datasets, and simulation environments for imitation and RL.

```
  Score     81/100
  Stars     ⭐ 23,527 (+911 last 30d, +208 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      imitation-learning · pytorch · reinforcement-learning · robotics
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/huggingface/trl">TRL</a></b> <code>⭐ 18.2K</code> <code>↗️ +406</code> <code>Apache-2.0</code> RLHF, DPO, and GRPO trainers for LLM alignment</summary>

<br>

Transformer Reinforcement Learning with SFT, DPO, RLHF, and GRPO trainers for alignment and preference tuning (Hugging Face).

```
  Score     77/100
  Stars     ⭐ 18,160 (+406 last 30d, +79 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      deep-learning · fine-tuning · huggingface · llm · python
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/huggingface/peft">PEFT</a></b> <code>⭐ 21.0K</code> <code>↗️ +182</code> <code>Apache-2.0</code> Standard LoRA and parameter-efficient fine-tuning library</summary>

<br>

Standard library for parameter-efficient fine-tuning - LoRA, QLoRA, Spectrum, and more. Deeply integrated with the Hugging Face ecosystem.

```
  Score     75/100
  Stars     ⭐ 20,998 (+182 last 30d, +39 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      adapter · diffusion · fine-tuning · llm · lora
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/axolotl-ai-cloud/axolotl">Axolotl</a></b> <code>⭐ 11.8K</code> <code>↗️ +262</code> <code>Apache-2.0</code> Production-grade multi-GPU fine-tuning framework</summary>

<br>

Production-grade fine-tuning with multi-GPU support, sequence parallelism, and multimodal capabilities.

```
  Score     75/100
  Stars     ⭐ 11,756 (+262 last 30d, +43 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      fine-tuning · llm
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/Lightning-AI/litgpt">LitGPT</a></b> <code>⭐ 13.3K</code> <code>↗️ +85</code> <code>Apache-2.0</code> Pretrain, fine-tune, and deploy 20+ LLM architectures</summary>

<br>

Recipes for pretraining, fine-tuning, and deploying 20+ LLM architectures on your own data (Lightning AI).

```
  Score     72/100
  Stars     ⭐ 13,325 (+85 last 30d, +19 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      ai · artificial-intelligence · deep-learning · large-language-models · llm
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/meta-pytorch/torchtune">torchtune</a></b> <code>⭐ 5.7K</code> <code>↗️ +36</code> <code>BSD-3-Clause</code> Native PyTorch LLM fine-tuning with YAML configs</summary>

<br>

Native PyTorch library for fine-tuning LLMs with composable building blocks and YAML configs (Meta).

```
  Score     70/100
  Stars     ⭐ 5,739 (+36 last 30d, +7 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2025
  License   BSD-3-Clause
  Tags      deep-learning · fine-tuning · llm · meta · post-training
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/OptimalScale/LMFlow">LMFlow</a></b> <code>⭐ 8.5K</code> <code>Apache-2.0</code> Extensible fine-tuning toolkit, NAACL 2024 award</summary>

<br>

Extensible toolkit for fine-tuning and inference of large foundation models, NAACL 2024 Best Demo Award.

```
  Score     69/100
  Stars     ⭐ 8,485 (+5 last 30d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      chatgpt · deep-learning · instruction-following · language-model · pretrained-models
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/huggingface/autotrain-advanced">Hugging Face AutoTrain</a></b> <code>⭐ 4.6K</code> <code>Apache-2.0</code> No-code LLM and vision-language model training</summary>

<br>

No-code training for LLMs, vision-language models, text classification, and tabular data (Hugging Face).

```
  Score     68/100
  Stars     ⭐ 4,571 (+9 last 30d, +1 last 7d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      autotrain · deep-learning · huggingface · machine-learning · natural-language-processing
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/h2oai/h2o-llmstudio">H2O LLM Studio</a></b> <code>⭐ 4.9K</code> <code>↗️ +23</code> <code>Apache-2.0</code> No-code GUI for LLM fine-tuning and RLHF</summary>

<br>

No-code GUI for fine-tuning LLMs with SFT, DPO, and RLHF, plus experiment tracking and one-click Hugging Face Hub export (H2O.ai).

```
  Score     68/100
  Stars     ⭐ 4,915 (+23 last 30d, +6 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ai · chatbot · chatgpt · fedramp · fine-tuning
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/mosaicml/llm-foundry">LLM Foundry</a></b> <code>⭐ 4.4K</code> <code>Apache-2.0</code> Composable pretraining and fine-tuning for foundation models</summary>

<br>

Composable building blocks for pretraining, fine-tuning, and evaluating foundation models with efficient distributed training (Databricks).

```
  Score     66/100
  Stars     ⭐ 4,400 (+8 last 30d, +2 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      deep-learning · llm · neural-networks · nlp · pytorch
```

</details>

<details><summary>🟡 <b>13</b> <b><a href="https://github.com/predibase/lorax">LoRAX</a></b> <code>⭐ 3.8K</code> <code>↗️ +27</code> <code>Apache-2.0</code> Thousands of LoRA adapters on a single GPU</summary>

<br>

Multi-LoRA inference server that scales to thousands of fine-tuned LLMs on a single GPU (Predibase).

```
  Score     56/100
  Stars     ⭐ 3,764 (+27 last 30d, +11 last 7d)
  Activity  🟡 May 2025
  Release   📦 Jan 2025
  License   Apache-2.0
  Tags      fine-tuning · gpt · llama · llm · llm-inference
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Prompt Optimization

*Systematic optimization of prompts, instructions, and demonstrations to improve LLM performance without manual tuning.*

<details><summary>🟢 🥇 <b><a href="https://github.com/stanfordnlp/dspy">DSPy</a></b> <code>⭐ 34.0K</code> <code>↗️ +873</code> <code>MIT</code> Automatic prompt optimizers replacing hand-written prompts</summary>

<br>

Declarative framework replacing hand-written prompts with automatic optimizers - GPT-3.5 with DSPy outperforms expert prompts by up to 46% (Stanford NLP).

```
  Score     80/100
  Stars     ⭐ 33,988 (+873 last 30d, +219 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      dspy · llm · nlp · prompt-optimization · prompting
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/gepa-ai/gepa">GEPA</a></b> <code>⭐ 4.0K</code> <code>↗️ +1013</code> <code>MIT</code> Reflective text evolution for prompt optimization</summary>

<br>

Genetic-Pareto reflective prompt optimizer - outperforms RL methods like GRPO by up to 20% while using 35x fewer rollouts; available as dspy.GEPA (ICLR 2026 Oral).

```
  Score     80/100
  Stars     ⭐ 3,985 (+1013 last 30d, +406 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      evolutionary-algorithms · llm · optimization · prompt-optimization · python
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/Mirascope/mirascope">Mirascope</a></b> <code>⭐ 1.5K</code> <code>↗️ +30</code> <code>MIT</code> Pythonic LLM toolkit with prompt versioning and tracing</summary>

<br>

Pythonic toolkit for building LLM applications with integrated prompt versioning, tracing, and optimization.

```
  Score     67/100
  Stars     ⭐ 1,467 (+30 last 30d, +8 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      artificial-intelligence · developer-tools · llm · llm-agent · llm-tools
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/meta-llama/prompt-ops">Prompt-Ops</a></b> <code>⭐ 804</code> <code>↗️ +18</code> <code>MIT</code> CLI for building and managing prompts at scale</summary>

<br>

Open-source command-line tool for building, optimizing, and managing prompts at scale (Meta).

```
  Score     65/100
  Stars     ⭐ 804 (+18 last 30d, +4 last 7d)
  Activity  🟢 Apr 2026
  License   MIT
  Tags      llama · llm · meta · prompt-engineering · prompt-optimization
```

</details>

<details><summary>🟡 <b>5</b> <b><a href="https://github.com/microsoft/PromptWizard">PromptWizard</a></b> <code>⭐ 3.8K</code> <code>↗️ +26</code> <code>MIT</code> Agent-driven self-evolving prompt optimization</summary>

<br>

Task-aware agent-driven prompt optimization using self-evolving critique and synthesis (Microsoft).

```
  Score     59/100
  Stars     ⭐ 3,839 (+26 last 30d, +7 last 7d)
  Activity  🟡 Oct 2025
  License   MIT
  Tags      automl · llm · microsoft · prompt-engineering · prompt-optimization
```

</details>

<details><summary>🟡 <b>6</b> <b><a href="https://github.com/zou-group/textgrad">TextGrad</a></b> <code>⭐ 3.5K</code> <code>↗️ +65</code> <code>MIT</code> Gradient-like optimization of AI via text feedback</summary>

<br>

Automatic differentiation via text feedback, enabling gradient-like optimization of compound AI systems (Nature 2024).

```
  Score     59/100
  Stars     ⭐ 3,510 (+65 last 30d, +13 last 7d)
  Activity  🟡 Jul 2025
  Release   📦 Dec 2024
  License   MIT
  Tags      ai-optimization · compound-systems · large-language-models · prompt-optimization · textual-gradients
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/Eladlev/AutoPrompt">AutoPrompt</a></b> <code>⭐ 3.0K</code> <code>↗️ +14</code> <code>Apache-2.0</code> Intent-based iterative prompt calibration with synthetic data</summary>

<br>

Intent-based prompt calibration using synthetic data generation for iterative prompt refinement.

```
  Score     59/100
  Stars     ⭐ 2,963 (+14 last 30d, +3 last 7d)
  Activity  🟢 Dec 2025
  Release   📦 Mar 2024
  License   Apache-2.0
  Tags      prompt-engineering · prompt-tuning · synthetic-dataset-generation
```

</details>

<details><summary>🟡 <b>8</b> <b><a href="https://github.com/beeevita/EvoPrompt">EvoPrompt</a></b> <code>⭐ 233</code> <code>↗️ +13</code> <code>MIT</code> Evolutionary algorithms for discrete prompt optimization</summary>

<br>

Connects LLMs with evolutionary algorithms for discrete prompt optimization with up to 25% improvement over manual prompts.

```
  Score     57/100
  Stars     ⭐ 233 (+13 last 30d, +5 last 7d)
  Activity  🟡 Sep 2025
  License   MIT
  Tags      evolutionary-algorithms · genetic-algorithms · llm · prompt-optimization · python
```

</details>

<details><summary>🟡 <b>9</b> <b><a href="https://github.com/SalesforceAIResearch/promptomatix">Promptomatix</a></b> <code>⭐ 949</code> <code>↗️ +17</code> <code>Apache-2.0</code> Task descriptions to optimized prompts automatically</summary>

<br>

DSPy-powered automatic prompt optimization that transforms task descriptions into optimized prompts with cost-aware objectives (Salesforce).

```
  Score     54/100
  Stars     ⭐ 949 (+17 last 30d, +1 last 7d)
  Activity  🟡 Aug 2025
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      automl · llm · nlp · prompt-optimization · python
```

</details>


**[⬆ Back to Contents](#contents)**

## Agent Frameworks

*Libraries and SDKs for building multi-agent systems, conversational agents, tool-using agents, and agentic workflows. Also includes agent infrastructure like memory, browser control, and sandboxes.*

<details><summary>🟢 🥇 <b><a href="https://github.com/browser-use/browser-use">Browser Use</a></b> <code>⭐ 90.0K</code> <code>↗️ +5832</code> <code>MIT</code> LLM-driven browser automation framework</summary>

<br>

Playwright-powered agent harness that makes websites accessible to LLMs so they can navigate, fill forms, and automate tasks across real browsers.

```
  Score     90/100
  Stars     ⭐ 90,001 (+5832 last 30d, +1693 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      ai-agents · ai-tools · browser-automation · browser-use · llm
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/langchain-ai/langgraph">LangGraph</a></b> <code>⭐ 30.3K</code> <code>↗️ +2905</code> <code>MIT</code> Stateful graph runtime for agents</summary>

<br>

LangChain's graph-based runtime for building stateful, resilient agents with checkpointing, human-in-the-loop, and controllable multi-actor workflows.

```
  Score     87/100
  Stars     ⭐ 30,276 (+2905 last 30d, +748 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      agents · ai · ai-agents · chatgpt · deepagents
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/mem0ai/mem0">Mem0</a></b> <code>⭐ 54.0K</code> <code>↗️ +3131</code> <code>Apache-2.0</code> Universal memory layer for agents</summary>

<br>

Universal memory layer that gives AI agents persistent, personalized long-term memory with extraction, retrieval, and graph-backed storage.

```
  Score     87/100
  Stars     ⭐ 53,998 (+3131 last 30d, +651 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agents · ai · ai-agents · application · chatbots
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/openai/openai-agents-python">OpenAI Agents SDK</a></b> <code>⭐ 25.0K</code> <code>↗️ +4754</code> <code>MIT</code> OpenAI's multi-agent and voice-agent SDK</summary>

<br>

Lightweight framework for multi-agent workflows with handoffs, guardrails, tracing, and voice-agent support across Python and JavaScript (OpenAI).

```
  Score     87/100
  Stars     ⭐ 24,981 (+4754 last 30d, +3196 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      agent · agents-sdk · ai-agents · llm · multi-agent
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/crewAIInc/crewAI">CrewAI</a></b> <code>⭐ 49.8K</code> <code>↗️ +2772</code> <code>MIT</code> Role-playing specialist agents for complex workflows</summary>

<br>

Multi-agent framework orchestrating role-playing specialist agents for complex AI workflows.

```
  Score     86/100
  Stars     ⭐ 49,800 (+2772 last 30d, +679 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      agents · ai · ai-agents · aiagentframework · llms
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/microsoft/agent-framework">Microsoft Agent Framework</a></b> <code>⭐ 9.8K</code> <code>↗️ +1621</code> <code>MIT</code> Unified Semantic Kernel plus AutoGen successor</summary>

<br>

Unified 1.0 SDK (April 2026) that merges Semantic Kernel and AutoGen into a single production-ready framework for agents and multi-agent workflows (Microsoft).

```
  Score     83/100
  Stars     ⭐ 9,783 (+1621 last 30d, +237 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      agent · agent-framework · ai · autogen · dotnet
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/pydantic/pydantic-ai">Pydantic AI</a></b> <code>⭐ 16.6K</code> <code>↗️ +867</code> <code>MIT</code> Typed agents the Pydantic way</summary>

<br>

Agent framework from the Pydantic team that brings typed validation, dependency injection, and structured outputs to LLM apps across providers.

```
  Score     82/100
  Stars     ⭐ 16,604 (+867 last 30d, +169 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      agent-framework · genai · llm · pydantic · python
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/google/adk-python">Google ADK for Python</a></b> <code>⭐ 19.2K</code> <code>↗️ +712</code> <code>Apache-2.0</code> Google's production agent development kit</summary>

<br>

Google's code-first Python toolkit for building, evaluating, and deploying production AI agents with the same stack powering Gemini and Agentspace.

```
  Score     80/100
  Stars     ⭐ 19,243 (+712 last 30d, +186 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent · agentic · agentic-ai · agents · agents-sdk
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/huggingface/smolagents">smolagents</a></b> <code>⭐ 26.9K</code> <code>↗️ +650</code> <code>Apache-2.0</code> Barebones code-writing agents library</summary>

<br>

Hugging Face's minimalist agent library where agents reason by writing and executing Python code rather than emitting JSON tool calls.

```
  Score     79/100
  Stars     ⭐ 26,871 (+650 last 30d, +182 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Jan 2026
  License   Apache-2.0
  Tags      agents · code-agents · huggingface · llm · python
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/e2b-dev/e2b">E2B</a></b> <code>⭐ 11.9K</code> <code>↗️ +508</code> <code>Apache-2.0</code> Secure code sandboxes for agents</summary>

<br>

Open-source secure cloud sandboxes that give AI agents isolated Linux VMs to run generated code, browsers, and real-world developer tools.

```
  Score     79/100
  Stars     ⭐ 11,913 (+508 last 30d, +149 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent · ai · ai-agent · ai-agents · code-interpreter
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/strands-agents/sdk-python">Strands Agents</a></b> <code>⭐ 5.7K</code> <code>↗️ +347</code> <code>Apache-2.0</code> AWS model-driven agents SDK, 14M downloads</summary>

<br>

Model-driven SDK that builds agents in a few lines of code - 14M+ downloads, Python and TypeScript builds, deploys to Bedrock AgentCore, Lambda, Fargate, or Kubernetes (AWS).

```
  Score     79/100
  Stars     ⭐ 5,698 (+347 last 30d, +47 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent · agents-sdk · aws · bedrock · llm
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/ag2ai/ag2">AG2</a></b> <code>⭐ 4.4K</code> <code>↗️ +141</code> <code>Apache-2.0</code> Multi-agent AgentOS from AutoGen lineage</summary>

<br>

Open-source AgentOS (formerly AutoGen) for building multi-agent systems with conversation patterns, tool use, and code execution across LLM providers.

```
  Score     73/100
  Stars     ⭐ 4,443 (+141 last 30d, +31 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      a2a · ag2 · agent-framework · agentic · agentic-ai
```

</details>

<details><summary>🟢 <b>13</b> <b><a href="https://github.com/microsoft/magentic-ui">Magentic-UI</a></b> <code>⭐ 9.8K</code> <code>↗️ +79</code> <code>MIT</code> Human-in-the-loop web agent prototype</summary>

<br>

Microsoft Research prototype for a human-centered web agent with co-planning, action previews, and transparent browser control built on AutoGen.

```
  Score     71/100
  Stars     ⭐ 9,792 (+79 last 30d, +19 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Nov 2025
  License   MIT
  Tags      agents · ai · ai-ux · autogen · browser-use
```

</details>


**[⬆ Back to Contents](#contents)**

## Coding Agents

*Ready-to-use AI agents that autonomously write, debug, refactor, and review software code.*

<details><summary>🟢 🥇 <b><a href="https://github.com/sst/opencode">OpenCode</a></b> <code>⭐ 148.9K</code> <code>↗️ +19460</code> <code>MIT</code> Terminal-native, model-agnostic coding agent</summary>

<br>

Terminal-native AI coding agent that is model-agnostic and scriptable for headless workflows, breakout 2026 OSS entry.

```
  Score     93/100
  Stars     ⭐ 148,947 (+19460 last 30d, +3985 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      agent · ai · cli · coding-agent · llm
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/block/goose">Goose</a></b> <code>⭐ 43.2K</code> <code>↗️ +9808</code> <code>Apache-2.0</code> Local MCP-based engineering agent from Block</summary>

<br>

Local, extensible AI agent that handles complex engineering tasks end-to-end via the Model Context Protocol (Block, formerly Square).

```
  Score     89/100
  Stars     ⭐ 43,165 (+9808 last 30d, +669 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent · ai · mcp · mcp-client · model-context-protocol
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/google-gemini/gemini-cli">Gemini CLI</a></b> <code>⭐ 102.3K</code> <code>↗️ +3703</code> <code>Apache-2.0</code> Google's open-source agentic terminal for Gemini</summary>

<br>

Open-source agentic CLI bringing Gemini models and ReAct-style tool use directly to the terminal (Google).

```
  Score     86/100
  Stars     ⭐ 102,323 (+3703 last 30d, +765 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent · cli · gemini · google · llm
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/anthropics/claude-code">Claude Code</a></b> <code>⭐ 117.6K</code> <code>↗️ +35547</code> Anthropic's 80.8% SWE-bench terminal coding agent</summary>

<br>

Terminal-native coding agent that hits ~80.8% on SWE-bench Verified with Opus 4.6 and ships as CLI plus IDE extensions (Anthropic).

```
  Score     84/100
  Stars     ⭐ 117,637 (+35547 last 30d, +2425 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   -
  Tags      agent · agentic · ai · anthropic · claude
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/Aider-AI/aider">Aider</a></b> <code>⭐ 43.9K</code> <code>↗️ +1664</code> <code>Apache-2.0</code> AI pair programmer editing your local repository</summary>

<br>

AI pair programmer in the terminal that edits code directly in your local repository.

```
  Score     83/100
  Stars     ⭐ 43,889 (+1664 last 30d, +387 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Aug 2025
  License   Apache-2.0
  Tags      anthropic · chatgpt · claude-3 · cli · command-line
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/cline/cline">Cline</a></b> <code>⭐ 61.0K</code> <code>↗️ +1829</code> <code>Apache-2.0</code> Approval-gated autonomous agent inside VS Code</summary>

<br>

Autonomous VS Code extension with Plan and Act modes where every file edit, terminal command, and browser action requires explicit approval.

```
  Score     83/100
  Stars     ⭐ 60,959 (+1829 last 30d, +575 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent · ai · autonomous-agents · coding-agent · developer-tools
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/OpenHands/OpenHands">OpenHands</a></b> <code>⭐ 72.0K</code> <code>↗️ +2463</code> <code>NOASSERTION</code> AI dev platform, 53-72% SWE-Bench resolve rate</summary>

<br>

AI software development platform achieving 53-72% resolve rate on SWE-Bench Verified.

```
  Score     80/100
  Stars     ⭐ 72,004 (+2463 last 30d, +595 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   NOASSERTION
  Tags      agent · artificial-intelligence · chatgpt · claude-ai · cli
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/SWE-agent/mini-swe-agent">mini-swe-agent</a></b> <code>⭐ 4.0K</code> <code>↗️ +493</code> <code>MIT</code> 100-line agent with 74% SWE-bench score</summary>

<br>

Minimalist 100-line coding agent achieving 74% on SWE-bench Verified as a learning reference.

```
  Score     80/100
  Stars     ⭐ 3,990 (+493 last 30d, +102 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      agent · agentic-ai · agentic-ai-cli · ai · ai-agent
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/continuedev/continue">Continue</a></b> <code>⭐ 32.8K</code> <code>↗️ +822</code> <code>Apache-2.0</code> Open-source IDE assistant with CI-enforceable AI checks</summary>

<br>

Open-source IDE assistant and CLI that supports source-controlled AI checks enforceable in CI, across VS Code, JetBrains, and terminal.

```
  Score     80/100
  Stars     ⭐ 32,777 (+822 last 30d, +159 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      ai · chatgpt · copilot · developer-tools · ide
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/SWE-agent/SWE-agent">SWE-agent</a></b> <code>⭐ 19.1K</code> <code>↗️ +251</code> <code>MIT</code> Autonomous agent solving real GitHub issues</summary>

<br>

Autonomous agent that solves real GitHub issues by reading, editing, and testing code (NeurIPS 2024).

```
  Score     75/100
  Stars     ⭐ 19,052 (+251 last 30d, +51 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 May 2025
  License   MIT
  Tags      agent · agent-based-model · ai · cybersecurity · developer-tools
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/AutoCodeRoverSG/auto-code-rover">AutoCodeRover</a></i> <code>⭐ 3.1K</code> <code>NOASSERTION</code> Structure-aware autonomous code repair and patching</summary>

<br>

*Structure-aware autonomous program repair combining code search with LLM-based patching. **Unmaintained - no commits for 12+ months.***

```
  Score     50/100
  Stars     ⭐ 3,068 (n/a)
  Activity  🔴 Apr 2025 - unmaintained 12+ months
  Release   📦 Sep 2024
  License   NOASSERTION
  Tags      agents · autonomous-agents · code-generation · llm · program-repair
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

<details><summary>🏢 <b><a href="https://windsurf.com">Windsurf</a></b> Speed-optimized agentic IDE from Cognition</summary>

<br>

Agentic IDE with proprietary SWE-1.5 model emphasising speed at ~950 tokens/sec while scoring 40.08% on SWE-Bench (Cognition).

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

<details><summary>🟢 🥇 <b><a href="https://github.com/microsoft/RD-Agent">R&D-Agent</a></b> <code>⭐ 12.7K</code> <code>↗️ +664</code> <code>MIT</code> Microsoft multi-agent R&D loop for data-driven AI</summary>

<br>

Multi-agent framework automating the full R&D loop for data-driven AI (hypothesis, implementation, evaluation, iteration); top-performing MLE-Bench agent at 35.1% any-medal rate on its chosen components (Microsoft, ICLR 2026 submission).

```
  Score     81/100
  Stars     ⭐ 12,654 (+664 last 30d, +103 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Nov 2025
  License   MIT
  Tags      agents · autonomous-research · llm-agents · machine-learning · mle-bench
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/karpathy/autoresearch">AutoResearch</a></b> <code>⭐ 76.3K</code> <code>↗️ +20671</code> Agents run 100 ML experiments overnight autonomously</summary>

<br>

Minimal script enabling AI agents to autonomously run ~100 ML experiments overnight at ~12/hour, finding genuine improvements that transfer to larger models (Karpathy, March 2026).

```
  Score     80/100
  Stars     ⭐ 76,310 (+20671 last 30d, +2485 last 7d)
  Activity  🟢 Mar 2026
  License   -
  Tags      agents · automated-research · autonomous-agents · llm · machine-learning
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/assafelovic/gpt-researcher">GPT Researcher</a></b> <code>⭐ 26.7K</code> <code>↗️ +724</code> <code>Apache-2.0</code> Autonomous deep-research report agent</summary>

<br>

Autonomous research agent that plans queries, scrapes sources, and writes cited multi-page reports using any LLM with optional MCP server mode.

```
  Score     78/100
  Stars     ⭐ 26,675 (+724 last 30d, +164 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent · ai · automation · deepresearch · llms
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/SakanaAI/AI-Scientist">AI-Scientist</a></b> <code>⭐ 13.4K</code> <code>↗️ +869</code> <code>NOASSERTION</code> Fully automated discovery from idea to paper</summary>

<br>

Fully automated open-ended scientific discovery from idea generation to experiment execution to paper writing (Sakana AI).

```
  Score     72/100
  Stars     ⭐ 13,395 (+869 last 30d, +109 last 7d)
  Activity  🟢 Dec 2025
  License   NOASSERTION
  Tags      agents · automated-research · autonomous-agents · llm · python
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/WecoAI/aideml">AIDE</a></b> <code>⭐ 1.2K</code> <code>↗️ +62</code> <code>MIT</code> ML agent beating 50% of human Kaggle competitors</summary>

<br>

ML engineering agent using tree search over solution space - exceeds 50% of human Kaggle competitors; top agents using AIDE achieve medals in 64%+ of MLE-Bench competitions (Weco AI).

```
  Score     72/100
  Stars     ⭐ 1,241 (+62 last 30d, +17 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Nov 2025
  License   MIT
  Tags      ai · ai-agents · automated-machine-learning · autonomous-agents · autoresearch
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/Future-House/paper-qa">PaperQA</a></b> <code>⭐ 8.4K</code> <code>↗️ +122</code> <code>Apache-2.0</code> High-accuracy RAG over scientific literature</summary>

<br>

High-accuracy retrieval-augmented generation for answering questions from scientific literature.

```
  Score     70/100
  Stars     ⭐ 8,418 (+122 last 30d, +31 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      ai · rag · science · search
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/SakanaAI/AI-Scientist-v2">AI-Scientist-v2</a></b> <code>⭐ 5.8K</code> <code>↗️ +3501</code> <code>NOASSERTION</code> First AI paper accepted at peer-reviewed workshop</summary>

<br>

Second generation using agentic tree search, producing the first AI-generated paper accepted at a peer-reviewed workshop.

```
  Score     70/100
  Stars     ⭐ 5,842 (+3501 last 30d, +178 last 7d)
  Activity  🟢 Dec 2025
  License   NOASSERTION
  Tags      agentic-search · agents · automated-research · autonomous-agents · llm
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/aibuildai/AI-Build-AI">AIBuildAI</a></b> <code>⭐ 255</code> <code>↗️ +70</code> <code>MIT</code> SOTA on MLE-Bench (63.1% medal rate, March 2026)</summary>

<br>

Hierarchical agent system for autonomous AI model development; ranked

```
  Score     70/100
  Stars     ⭐ 255 (+70 last 30d, +8 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      agents · autonomous-agents · machine-learning · mle-bench · multi-agent
```

</details>

<details><summary>🟡 <b>9</b> <b><a href="https://github.com/stanford-oval/storm">STORM</a></b> <code>⭐ 28.1K</code> <code>↗️ +163</code> <code>MIT</code> LLM researches topics and writes full articles</summary>

<br>

LLM-powered knowledge curation that researches topics and generates full articles with citations (Stanford).

```
  Score     65/100
  Stars     ⭐ 28,125 (+163 last 30d, +27 last 7d)
  Activity  🟡 Sep 2025
  Release   📦 Jan 2025
  License   MIT
  Tags      agentic-rag · deep-research · emnlp2024 · knowledge-curation · large-language-models
```

</details>

<details><summary>🟡 <b>10</b> <b><a href="https://github.com/HKUDS/AI-Researcher">AI-Researcher</a></b> <code>⭐ 5.2K</code> <code>↗️ +279</code> Full research lifecycle from literature to experiments</summary>

<br>

Autonomous agent automating the full research lifecycle from literature review to experimentation (NeurIPS 2025 Spotlight).

```
  Score     60/100
  Stars     ⭐ 5,213 (+279 last 30d, +60 last 7d)
  Activity  🟡 Oct 2025
  License   -
  Tags      ai-researcher
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/InternScience/MLEvolve">MLEvolve</a></b> <code>⭐ 269</code> <code>↗️ +31</code> Progressive search + experience memory for ML agents</summary>

<br>

End-to-end ML algorithm design and optimization via progressive search and experience-driven memory; tracked on the MLE-Bench leaderboard alongside AIDE and R&D-Agent.

```
  Score     60/100
  Stars     ⭐ 269 (+31 last 30d, +2 last 7d)
  Activity  🟢 Mar 2026
  License   -
  Tags      agents · automl · evolutionary-search · machine-learning · mle-bench
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/FractalAIResearchLabs/PiEvolve">PiEvolve</a></b> <code>⭐ 21</code> <code>MIT</code> Rank-1 on OpenAI MLE-Bench via evolutionary search</summary>

<br>

Evolutionary agent for long-horizon tasks; achieved Rank-1 overall on the OpenAI MLE-Bench leaderboard with compute-efficient variant ranked 4th at ~50% budget (Fractal AI Research).

```
  Score     55/100
  Stars     ⭐ 21 (+3 last 30d, +1 last 7d)
  Activity  🟢 Jan 2026
  License   MIT
  Tags      agents · autonomous-agents · evolutionary-search · machine-learning · mle-bench
```

</details>

<details><summary>🟡 <b>13</b> <b><a href="https://github.com/DeepAuto-AI/automl-agent">AutoML-Agent</a></b> <code>⭐ 121</code> <code>↗️ +11</code> LLM agents for end-to-end AutoML pipelines</summary>

<br>

Multi-agent LLM framework for full-pipeline AutoML from data retrieval through model deployment (ICML 2025).

```
  Score     47/100
  Stars     ⭐ 121 (+11 last 30d, 0 last 7d)
  Activity  🟡 Jul 2025
  License   -
  Tags      automl · llm-agents · multi-agent-systems
```

</details>


**[⬆ Back to Contents](#contents)**

## LLM Evaluation and Testing

*Frameworks for automated evaluation, testing, benchmarking, and red-teaming of language models, RAG pipelines, and agentic systems.*

<details><summary>🟢 🥇 <b><a href="https://github.com/promptfoo/promptfoo">Promptfoo</a></b> <code>⭐ 20.5K</code> <code>↗️ +2123</code> <code>MIT</code> Test and red-team LLMs with CI/CD integration</summary>

<br>

Test and red-team LLM applications with automated evaluations, CI/CD integration, and vulnerability scanning.

```
  Score     86/100
  Stars     ⭐ 20,537 (+2123 last 30d, +312 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      ci · ci-cd · cicd · evaluation · evaluation-framework
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/confident-ai/deepeval">DeepEval</a></b> <code>⭐ 15.0K</code> <code>↗️ +725</code> <code>Apache-2.0</code> Pytest-style LLM evaluation with 14+ metrics</summary>

<br>

Pytest-like framework with 14+ evaluation metrics for RAG, fine-tuning, and alignment assessment.

```
  Score     81/100
  Stars     ⭐ 14,973 (+725 last 30d, +124 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      evaluation-framework · evaluation-metrics · llm-evaluation · llm-evaluation-framework · llm-evaluation-metrics
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/EleutherAI/lm-evaluation-harness">lm-evaluation-harness</a></b> <code>⭐ 12.3K</code> <code>↗️ +488</code> <code>MIT</code> Standard few-shot LLM evaluation across hundreds of benchmarks</summary>

<br>

Standard framework for few-shot evaluation of language models across hundreds of benchmarks (EleutherAI).

```
  Score     78/100
  Stars     ⭐ 12,311 (+488 last 30d, +83 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Feb 2026
  License   MIT
  Tags      evaluation-framework · language-model · transformer
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/vibrantlabsai/ragas">RAGAS</a></b> <code>⭐ 13.6K</code> <code>↗️ +551</code> <code>Apache-2.0</code> Evaluate RAG retrieval and generation quality</summary>

<br>

Evaluation framework for RAG quality assessment measuring both retrieval and generation with LLM-based and traditional metrics.

```
  Score     75/100
  Stars     ⭐ 13,633 (+551 last 30d, +195 last 7d)
  Activity  🟢 Feb 2026
  Release   📦 Jan 2026
  License   Apache-2.0
  Tags      evaluation · llm · llmops
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/UKGovernmentBEIS/inspect_ai">Inspect AI</a></b> <code>⭐ 1.9K</code> <code>↗️ +104</code> <code>MIT</code> Reproducible sandboxed LLM evals, 100+ prebuilt</summary>

<br>

Framework for reproducible LLM evals with sandboxed agent execution, 100+ prebuilt evaluations, and VS Code integration (UK AI Safety Institute).

```
  Score     74/100
  Stars     ⭐ 1,946 (+104 last 30d, +38 last 7d)
  Activity  🟢 Apr 2026
  License   MIT
  Tags      ai-safety · benchmarking · evaluation · framework · llm
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/open-compass/opencompass">OpenCompass</a></b> <code>⭐ 6.9K</code> <code>↗️ +147</code> <code>Apache-2.0</code> One-stop evaluation for 100+ LLMs and benchmarks</summary>

<br>

One-stop evaluation platform supporting 100+ models across academic and real-world benchmarks.

```
  Score     73/100
  Stars     ⭐ 6,934 (+147 last 30d, +44 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Feb 2026
  License   Apache-2.0
  Tags      benchmark · chatgpt · evaluation · large-language-model · llama2
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/Marker-Inc-Korea/AutoRAG">AutoRAG</a></b> <code>⭐ 4.7K</code> <code>↗️ +92</code> <code>Apache-2.0</code> AutoML-style search for optimal RAG pipelines</summary>

<br>

AutoML-style framework for RAG optimization that automatically finds the best retrieval, generation, and prompt pipeline configuration.

```
  Score     72/100
  Stars     ⭐ 4,726 (+92 last 30d, +17 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      analysis · automl · benchmarking · document-parser · embeddings
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/ShishirPatil/gorilla">Gorilla</a></b> <code>⭐ 12.8K</code> <code>↗️ +86</code> <code>Apache-2.0</code> Function-calling models and BFCL leaderboard</summary>

<br>

UC Berkeley project training and evaluating LLMs for function and tool calling, home of the Berkeley Function-Calling Leaderboard (BFCL).

```
  Score     72/100
  Stars     ⭐ 12,849 (+86 last 30d, +15 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      api · api-documentation · chatgpt · claude-api · function-calling
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/truera/trulens">TruLens</a></b> <code>⭐ 3.3K</code> <code>↗️ +69</code> <code>MIT</code> OpenTelemetry tracing and evaluation for RAG agents</summary>

<br>

OpenTelemetry-based tracing and evaluation for RAG and agent workflows with built-in feedback functions (Snowflake/TruEra).

```
  Score     70/100
  Stars     ⭐ 3,266 (+69 last 30d, +13 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      agent-evaluation · agentops · ai-agents · ai-monitoring · ai-observability
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/openai/evals">OpenAI Evals</a></b> <code>⭐ 18.3K</code> <code>↗️ +214</code> <code>NOASSERTION</code> OpenAI's reference LLM eval framework and benchmark registry</summary>

<br>

Reference framework and open registry of LLM benchmarks from OpenAI - the original eval harness many downstream frameworks build on.

```
  Score     70/100
  Stars     ⭐ 18,270 (+214 last 30d, +45 last 7d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      benchmark · evaluation · gpt · llm · llm-evaluation
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/Agenta-AI/agenta">Agenta</a></b> <code>⭐ 4.1K</code> <code>↗️ +99</code> <code>NOASSERTION</code> LLMOps platform with playground and evaluation</summary>

<br>

Open-source LLMOps platform combining prompt playground, evaluation workflows, and production observability.

```
  Score     68/100
  Stars     ⭐ 4,057 (+99 last 30d, +24 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      agents · evaluation · llm-as-a-judge · llm-evaluation · llm-framework
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/huggingface/lighteval">LightEval</a></b> <code>⭐ 2.4K</code> <code>↗️ +35</code> <code>MIT</code> Powers the Open LLM Leaderboard, 1000+ tasks</summary>

<br>

All-in-one LLM evaluation toolkit powering the Open LLM Leaderboard, supporting 1000+ tasks across multiple backends (Hugging Face).

```
  Score     68/100
  Stars     ⭐ 2,388 (+35 last 30d, +9 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Nov 2025
  License   MIT
  Tags      evaluation · evaluation-framework · evaluation-metrics · huggingface
```

</details>

<details><summary>🟢 <b>13</b> <b><a href="https://github.com/langwatch/langwatch">LangWatch</a></b> <code>⭐ 3.2K</code> <code>↗️ +76</code> <code>NOASSERTION</code> LLM evaluation platform with automated quality guardrails</summary>

<br>

Evaluation and testing platform for LLM applications and AI agents with automated quality guardrails.

```
  Score     67/100
  Stars     ⭐ 3,223 (+76 last 30d, +17 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      ai · analytics · datasets · dspy · evaluation
```

</details>


**[⬆ Back to Contents](#contents)**

## LLM Routing and Selection

*Intelligent routing of requests to the optimal model based on task complexity, cost, and quality.*

<details><summary>🟢 🥇 <b><a href="https://github.com/BerriAI/litellm">LiteLLM</a></b> <code>⭐ 44.6K</code> <code>↗️ +4134</code> <code>NOASSERTION</code> Unified API gateway for 100+ LLMs</summary>

<br>

Unified API gateway for 100+ LLMs with load balancing, cost tracking, and automatic fallback routing.

```
  Score     85/100
  Stars     ⭐ 44,608 (+4134 last 30d, +904 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      ai-gateway · anthropic · azure-openai · bedrock · gateway
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/Portkey-AI/gateway">Portkey Gateway</a></b> <code>⭐ 11.4K</code> <code>↗️ +434</code> <code>MIT</code> AI gateway routing and caching across 200+ LLMs</summary>

<br>

AI gateway for intelligent routing, caching, load balancing, and fallbacks across 200+ LLMs.

```
  Score     76/100
  Stars     ⭐ 11,437 (+434 last 30d, +83 last 7d)
  Activity  🟢 Mar 2026
  Release   📦 Jan 2026
  License   MIT
  Tags      ai-gateway · gateway · generative-ai · hacktoberfest · langchain
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/ulab-uiuc/LLMRouter">LLMRouter</a></b> <code>⭐ 1.7K</code> <code>↗️ +171</code> <code>MIT</code> 16+ LLM router implementations with unified evaluation</summary>

<br>

Unified library with 16+ router implementations and standardized evaluation via command-line interface.

```
  Score     74/100
  Stars     ⭐ 1,718 (+171 last 30d, +37 last 7d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      inference · llm · llm-routing · model-selection · python
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/tensorzero/tensorzero">TensorZero</a></b> <code>⭐ 11.3K</code> <code>↗️ +149</code> <code>Apache-2.0</code> LLMOps platform with gateway, evals, and A/B testing</summary>

<br>

Open-source LLMOps platform unifying an LLM gateway, observability, evaluation, optimization, and experimentation with A/B testing across models.

```
  Score     74/100
  Stars     ⭐ 11,270 (+149 last 30d, +31 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ai · ai-engineering · anthropic · artificial-intelligence · deep-learning
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/lm-sys/RouteLLM">RouteLLM</a></i> <code>⭐ 4.8K</code> <code>Apache-2.0</code> LLM routers cutting costs 85% without quality loss</summary>

<br>

*Framework for training and serving LLM routers that reduce costs by up to 85% without quality loss (LMSYS). **Unmaintained - no commits for 12+ months.***

```
  Score     58/100
  Stars     ⭐ 4,813 (n/a)
  Activity  🔴 Aug 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      cost-optimization · inference · llm · llm-routing · python
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Monitoring and Observability

*Automated drift detection, performance monitoring, and quality observability for models deployed in production.*

<details><summary>🟢 🥇 <b><a href="https://github.com/Helicone/helicone">Helicone</a></b> <code>⭐ 5.5K</code> <code>↗️ +249</code> <code>Apache-2.0</code> One-line LLM observability for cost and latency tracking</summary>

<br>

LLM observability platform with one-line integration for cost tracking, latency analysis, prompt versioning, and usage dashboards (YC W23).

```
  Score     76/100
  Stars     ⭐ 5,548 (+249 last 30d, +44 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Aug 2025
  License   Apache-2.0
  Tags      agent-monitoring · analytics · evaluation · gpt · langchain
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/evidentlyai/evidently">Evidently</a></b> <code>⭐ 7.4K</code> <code>↗️ +98</code> <code>Apache-2.0</code> ML and LLM observability with 100+ production metrics</summary>

<br>

ML and LLM observability with 100+ metrics for evaluating, testing, and monitoring any AI system in production.

```
  Score     72/100
  Stars     ⭐ 7,420 (+98 last 30d, +23 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      data-drift · data-quality · data-science · data-validation · generative-ai
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/Giskard-AI/giskard-oss">Giskard</a></b> <code>⭐ 5.3K</code> <code>↗️ +113</code> <code>Apache-2.0</code> ML and LLM testing for bias and security vulnerabilities</summary>

<br>

Testing and evaluation for ML and LLM models covering bias, performance regression, and security vulnerabilities.

```
  Score     72/100
  Stars     ⭐ 5,299 (+113 last 30d, +28 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agent-evaluation · ai-red-team · ai-security · ai-testing · fairness-ai
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/traceloop/openllmetry">OpenLLMetry</a></b> <code>⭐ 7.0K</code> <code>↗️ +95</code> <code>Apache-2.0</code> OpenTelemetry observability with auto-instrumentation for LLMs</summary>

<br>

OpenTelemetry-based observability for LLM applications with automatic instrumentation for LangChain, LlamaIndex, and OpenAI SDK.

```
  Score     72/100
  Stars     ⭐ 7,035 (+95 last 30d, +18 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      artifical-intelligence · datascience · generative-ai · good-first-issue · good-first-issues
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/deepchecks/deepchecks">Deepchecks</a></b> <code>⭐ 4.0K</code> <code>↗️ +12</code> <code>NOASSERTION</code> Holistic ML validation suite for data and models</summary>

<br>

Holistic ML validation covering data integrity, drift detection, and model evaluation in a single suite.

```
  Score     57/100
  Stars     ⭐ 4,005 (+12 last 30d, +2 last 7d)
  Activity  🟢 Dec 2025
  Release   📦 Dec 2024
  License   NOASSERTION
  Tags      data-drift · data-science · data-validation · deep-learning · html-report
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/SeldonIO/alibi-detect">Alibi Detect</a></b> <code>⭐ 2.5K</code> <code>↗️ +15</code> <code>NOASSERTION</code> Outlier, adversarial, and drift detection across data types</summary>

<br>

Outlier, adversarial, and drift detection algorithms for tabular, text, image, and time-series data (Seldon).

```
  Score     55/100
  Stars     ⭐ 2,517 (+15 last 30d, +5 last 7d)
  Activity  🟢 Dec 2025
  Release   📦 Dec 2025
  License   NOASSERTION
  Tags      adversarial · anomaly · concept-drift · data-drift · detection
```

</details>

<details><summary>🟡 <b>7</b> <b><a href="https://github.com/NannyML/nannyml">NannyML</a></b> <code>⭐ 2.1K</code> <code>Apache-2.0</code> Estimate model performance without ground truth labels</summary>

<br>

Estimate model performance without ground truth labels and link data drift directly to accuracy degradation.

```
  Score     54/100
  Stars     ⭐ 2,135 (+4 last 30d, +1 last 7d)
  Activity  🟡 Jul 2025
  Release   📦 Jul 2025
  License   Apache-2.0
  Tags      data-analysis · data-drift · data-science · deep-learning · jupyter-notebook
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/whylabs/whylogs">WhyLogs</a></i> <code>⭐ 2.8K</code> <code>Apache-2.0</code> Lightweight drift detection without storing raw data</summary>

<br>

*Lightweight data logging library that profiles datasets for drift detection without storing raw data. **Unmaintained - no commits for 12+ months.***

```
  Score     53/100
  Stars     ⭐ 2,814 (n/a)
  Activity  🔴 Jan 2025 - unmaintained 12+ months
  Release   📦 Dec 2024
  License   Apache-2.0
  Tags      ai-pipelines · analytics · approximate-statistics · calculate-statistics · constraints
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated AI Safety

*Tools for automated safety testing, alignment evaluation, jailbreak detection, and guardrails on deployed AI systems.*

<details><summary>🟢 🥇 <b><a href="https://github.com/katanemo/plano">Plano</a></b> <code>⭐ 6.4K</code> <code>↗️ +379</code> <code>Apache-2.0</code> AI-native proxy with safety controls for agentic apps</summary>

<br>

AI-native proxy with built-in orchestration, safety controls, and observability for agentic applications.

```
  Score     80/100
  Stars     ⭐ 6,376 (+379 last 30d, +33 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ai-gateway · ai-gateway-support · envoy · envoyproxy · gateway
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/NVIDIA/garak">Garak</a></b> <code>⭐ 7.6K</code> <code>↗️ +301</code> <code>Apache-2.0</code> LLM vulnerability scanner with 100+ attack modules</summary>

<br>

LLM vulnerability scanner with 100+ attack modules covering prompt injection, data leakage, and jailbreaking.

```
  Score     77/100
  Stars     ⭐ 7,638 (+301 last 30d, +81 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ai · llm-evaluation · llm-security · security-scanners · vulnerability-assessment
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/confident-ai/deepteam">DeepTeam</a></b> <code>⭐ 1.6K</code> <code>↗️ +164</code> <code>Apache-2.0</code> Systematic red-teaming for LLM vulnerabilities</summary>

<br>

Red-teaming framework for systematically testing LLM vulnerabilities across multiple attack vectors.

```
  Score     77/100
  Stars     ⭐ 1,573 (+164 last 30d, +20 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      hacktoberfest · llm-guardrails · llm-red-teaming · llm-safety · python
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/guardrails-ai/guardrails">Guardrails AI</a></b> <code>⭐ 6.8K</code> <code>↗️ +180</code> <code>Apache-2.0</code> Structural and semantic validation guardrails for LLM outputs</summary>

<br>

Framework for adding structural and semantic validation guardrails to LLM outputs.

```
  Score     72/100
  Stars     ⭐ 6,750 (+180 last 30d, +60 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ai · foundation-model · gpt-3 · llm · openai
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/NVIDIA-NeMo/Guardrails">NeMo Guardrails</a></b> <code>⭐ 6.0K</code> <code>↗️ +191</code> <code>NOASSERTION</code> Programmable topical and safety rails for LLM conversations</summary>

<br>

Programmable safety rails for LLM-based conversational systems with topical and safety controls (NVIDIA).

```
  Score     71/100
  Stars     ⭐ 6,034 (+191 last 30d, +34 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   NOASSERTION
  Tags      agents · generative-ai · guardrails · llm-safety · llm-security
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/protectai/llm-guard">LLM Guard</a></b> <code>⭐ 2.9K</code> <code>↗️ +142</code> <code>MIT</code> Input/output scanners for prompt injection and leakage</summary>

<br>

Security toolkit with input/output scanners for prompt injection, data leakage, toxic content, and other safety risks in production LLM applications.

```
  Score     67/100
  Stars     ⭐ 2,865 (+142 last 30d, +29 last 7d)
  Activity  🟢 Dec 2025
  License   MIT
  Tags      adversarial-machine-learning · chatgpt · large-language-models · llm · llm-security
```

</details>


**[⬆ Back to Contents](#contents)**

## Time-Series AutoML

*Automated forecasting, classification, and anomaly detection for temporal data, including modern time-series foundation models.*

<details><summary>🟢 🥇 <b><a href="https://github.com/google-research/timesfm">TimesFM</a></b> <code>⭐ 18.5K</code> <code>↗️ +8409</code> <code>Apache-2.0</code> Zero-shot time-series forecasting foundation model</summary>

<br>

Time-series foundation model for zero-shot forecasting across domains without task-specific training (Google).

```
  Score     85/100
  Stars     ⭐ 18,482 (+8409 last 30d, +461 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2024
  License   Apache-2.0
  Tags      deep-learning · foundation-models · forecasting · google · pretrained-models
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/amazon-science/chronos-forecasting">Chronos</a></b> <code>⭐ 5.2K</code> <code>↗️ +226</code> <code>Apache-2.0</code> Pretrained probabilistic forecasting on unseen time-series</summary>

<br>

Pretrained time-series foundation model for zero-shot probabilistic forecasting on unseen data (Amazon).

```
  Score     76/100
  Stars     ⭐ 5,200 (+226 last 30d, +43 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      artificial-intelligence · forecasting · foundation-models · huggingface · huggingface-transformers
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/sktime/sktime">sktime</a></b> <code>⭐ 9.7K</code> <code>↗️ +94</code> <code>BSD-3-Clause</code> Unified sklearn-compatible time-series ML toolkit</summary>

<br>

Unified framework for time-series forecasting, classification, regression, and clustering with scikit-learn-compatible interfaces.

```
  Score     72/100
  Stars     ⭐ 9,745 (+94 last 30d, +10 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Nov 2025
  License   BSD-3-Clause
  Tags      ai · anomaly-detection · changepoint-detection · data-mining · data-science
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/unit8co/darts">Darts</a></b> <code>⭐ 9.3K</code> <code>↗️ +80</code> <code>Apache-2.0</code> Unified API for 30+ forecasting models with backtesting</summary>

<br>

Unified API for 30+ forecasting models from ARIMA to transformers, with backtesting and ensembling built in.

```
  Score     72/100
  Stars     ⭐ 9,348 (+80 last 30d, +16 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      anomaly-detection · data-science · deep-learning · forecasting · machine-learning
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/Nixtla/statsforecast">Nixtla StatsForecast</a></b> <code>⭐ 4.8K</code> <code>↗️ +40</code> <code>Apache-2.0</code> Lightning-fast AutoARIMA and AutoETS at scale</summary>

<br>

Lightning-fast statistical models including AutoARIMA, AutoETS, and AutoCES for millions of time series.

```
  Score     70/100
  Stars     ⭐ 4,763 (+40 last 30d, +3 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Oct 2025
  License   Apache-2.0
  Tags      arima · automl · baselines · data-science · econometrics
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/Nixtla/neuralforecast">Nixtla NeuralForecast</a></b> <code>⭐ 4.1K</code> <code>↗️ +54</code> <code>Apache-2.0</code> Production neural forecasting with 30+ models</summary>

<br>

Production-ready neural forecasting with 30+ state-of-the-art models including N-BEATS, TFT, and PatchTST.

```
  Score     70/100
  Stars     ⭐ 4,061 (+54 last 30d, +10 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      baselines · baselines-zoo · deep-learning · deep-neural-networks · deepar
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/WenjieDu/PyPOTS">PyPOTS</a></b> <code>⭐ 2.0K</code> <code>↗️ +32</code> <code>BSD-3-Clause</code> 50+ models for missing-value time-series analysis</summary>

<br>

Toolbox with 50+ deep learning models for partially-observed time-series imputation, classification, and clustering.

```
  Score     67/100
  Stars     ⭐ 2,001 (+32 last 30d, +3 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   BSD-3-Clause
  Tags      anomaly-detection · classification · clustering · data-analysis · data-mining
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/skforecast/skforecast">skforecast</a></b> <code>⭐ 1.5K</code> <code>↗️ +16</code> <code>BSD-3-Clause</code> Sklearn-compatible multi-step forecasting with gradient boosting</summary>

<br>

Scikit-learn-compatible multi-step forecasting with XGBoost, LightGBM, CatBoost, and feature engineering utilities.

```
  Score     66/100
  Stars     ⭐ 1,480 (+16 last 30d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   BSD-3-Clause
  Tags      arima · autoregressive-forecasting · backtesting-forecasters · data-science · direct-forecasting
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/aeon-toolkit/aeon">aeon</a></b> <code>⭐ 1.4K</code> <code>↗️ +21</code> <code>BSD-3-Clause</code> Next-generation time-series ML for all task types</summary>

<br>

Next-generation time-series ML toolkit for classification, regression, clustering, and anomaly detection.

```
  Score     66/100
  Stars     ⭐ 1,377 (+21 last 30d, +8 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   BSD-3-Clause
  Tags      aeon · ai · artificial-intelligence · data-mining · data-science
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/Nixtla/mlforecast">Nixtla MLForecast</a></b> <code>⭐ 1.2K</code> <code>↗️ +17</code> <code>Apache-2.0</code> Scalable LightGBM and XGBoost time-series forecasting</summary>

<br>

Scalable ML-based forecasting with LightGBM, XGBoost, and distributed backends via Dask, Spark, and Ray.

```
  Score     66/100
  Stars     ⭐ 1,214 (+17 last 30d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      dask · forecast · forecasting · lightgbm · machine-learning
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/winedarksea/AutoTS">AutoTS</a></b> <code>⭐ 1.4K</code> <code>MIT</code> Genetic algorithm AutoML for time-series forecasting</summary>

<br>

Genetic algorithm-based automated model selection, ensembling, and anomaly detection for time-series data.

```
  Score     65/100
  Stars     ⭐ 1,390 (+8 last 30d, +3 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      automl · autots · deep-learning · feature-engineering · forecasting
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/ibm-granite/granite-tsfm">Granite-TSFM</a></b> <code>⭐ 836</code> <code>↗️ +17</code> <code>Apache-2.0</code> Compact mixers rivaling billion-parameter forecasting models</summary>

<br>

Compact pretrained Tiny Time Mixers that rival billion-parameter models for zero/few-shot multivariate forecasting (IBM, NeurIPS 2024).

```
  Score     65/100
  Stars     ⭐ 836 (+17 last 30d, 0 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      deep-learning · forecasting · foundation-models · ibm · python
```

</details>

<details><summary>🟢 <b>13</b> <b><a href="https://github.com/Time-MoE/Time-MoE">Time-MoE</a></b> <code>⭐ 953</code> <code>↗️ +22</code> <code>Apache-2.0</code> Billion-scale sparse MoE time-series foundation model</summary>

<br>

First billion-scale time-series foundation model using sparse mixture-of-experts, trained on 300B+ time points (ICLR 2025 Spotlight).

```
  Score     64/100
  Stars     ⭐ 953 (+22 last 30d, +4 last 7d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      deep-learning · large-model · machine-learning · time-series · time-series-forecasting
```

</details>

<details><summary>🟢 <b>14</b> <b><a href="https://github.com/SalesforceAIResearch/uni2ts">Moirai</a></b> <code>⭐ 1.5K</code> <code>↗️ +27</code> <code>Apache-2.0</code> Universal multivariate time-series forecasting transformer</summary>

<br>

Universal time-series forecasting transformer supporting multivariate forecasting unlike most competitors. Moirai-MoE released Oct 2024 (Salesforce).

```
  Score     61/100
  Stars     ⭐ 1,477 (+27 last 30d, +10 last 7d)
  Activity  🟢 Jan 2026
  Release   📦 Nov 2025
  License   Apache-2.0
  Tags      deep-learning · forecasting · machine-learning · pre-trained-models · pre-training
```

</details>

<details><summary>🟡 <b>15</b> <b><a href="https://github.com/time-series-foundation-models/lag-llama">Lag-Llama</a></b> <code>⭐ 1.6K</code> <code>↗️ +12</code> <code>Apache-2.0</code> First open-source probabilistic time-series foundation model</summary>

<br>

First open-source foundation model for univariate probabilistic time-series forecasting based on a decoder-only transformer (NeurIPS 2024).

```
  Score     53/100
  Stars     ⭐ 1,573 (+12 last 30d, +3 last 7d)
  Activity  🟡 Jun 2025
  License   Apache-2.0
  Tags      forecasting · foundation-models · lag-llama · llama · time-series
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Data Preprocessing

*Automated cleaning, transformation, imputation, and quality assessment for raw data before training.*

<details><summary>🟢 🥇 <b><a href="https://github.com/microsoft/presidio">Presidio</a></b> <code>⭐ 7.8K</code> <code>↗️ +402</code> <code>MIT</code> PII detection and anonymization framework</summary>

<br>

Microsoft's PII detection and anonymization framework that redacts, masks, and de-identifies sensitive data across text, images, and structured records.

```
  Score     79/100
  Stars     ⭐ 7,776 (+402 last 30d, +131 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      anonymization · data-anonymization · data-masking · data-obfuscation · data-privacy
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/great-expectations/great_expectations">Great Expectations</a></b> <code>⭐ 11.4K</code> <code>↗️ +159</code> <code>Apache-2.0</code> Programmable data validation for pipeline quality</summary>

<br>

Programmable data validation and documentation framework for maintaining pipeline quality.

```
  Score     74/100
  Stars     ⭐ 11,439 (+159 last 30d, +25 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      cleandata · data-engineering · data-profilers · data-profiling · data-quality
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/Data-Centric-AI-Community/ydata-profiling">ydata-profiling</a></b> <code>⭐ 13.5K</code> <code>↗️ +96</code> <code>MIT</code> One-line EDA profiling for Pandas and Spark</summary>

<br>

One-line data quality profiling and exploratory analysis for Pandas and Spark DataFrames.

```
  Score     73/100
  Stars     ⭐ 13,525 (+96 last 30d, +11 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      big-data-analytics · data-analysis · data-exploration · data-profiling · data-quality
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/microsoft/data-formulator">Data Formulator</a></b> <code>⭐ 15.2K</code> <code>↗️ +99</code> <code>MIT</code> AI-driven data transformation and charts</summary>

<br>

Microsoft Research tool that uses AI to iteratively transform, reshape, and visualize tabular data through a concept-driven chart authoring UI.

```
  Score     73/100
  Stars     ⭐ 15,234 (+99 last 30d, +10 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      ai · data-transformation · llm · visualization
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/NVIDIA-NeMo/NeMo-Curator">NeMo Curator</a></b> <code>⭐ 1.5K</code> <code>↗️ +59</code> <code>Apache-2.0</code> GPU-scale LLM data curation toolkit</summary>

<br>

NVIDIA's GPU-accelerated toolkit for scalable LLM data curation with quality filtering, exact and semantic deduplication, and PII redaction.

```
  Score     71/100
  Stars     ⭐ 1,540 (+59 last 30d, +9 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Feb 2026
  License   Apache-2.0
  Tags      data · data-curation · data-prep · data-preparation · data-processing
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/unionai-oss/pandera">Pandera</a></b> <code>⭐ 4.3K</code> <code>↗️ +51</code> <code>MIT</code> Statistical schema validation for dataframes</summary>

<br>

Statistical data testing and validation for dataframes with expressive schema definitions.

```
  Score     70/100
  Stars     ⭐ 4,314 (+51 last 30d, +6 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      assertions · data-assertions · data-check · data-cleaning · data-processing
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/fbdesignpro/sweetviz">SweetViz</a></b> <code>⭐ 3.1K</code> <code>MIT</code> High-density EDA visualizations in two lines of code</summary>

<br>

High-density EDA visualizations and target analysis reports generated in two lines of code.

```
  Score     66/100
  Stars     ⭐ 3,092 (+6 last 30d, 0 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      data-analysis · data-exploration · data-profiling · data-science · data-visualization
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/Renumics/spotlight">Spotlight</a></b> <code>⭐ 1.3K</code> <code>MIT</code> Interactive auditing of unstructured ML datasets</summary>

<br>

Interactive visualization tool for auditing and understanding unstructured ML datasets covering images, audio, and text.

```
  Score     64/100
  Stars     ⭐ 1,255 (+2 last 30d, -1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      audio · computer-vision · data-centric-ai · data-curation · data-visualization
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/pyjanitor-devs/pyjanitor">pyjanitor</a></b> <code>⭐ 1.5K</code> <code>MIT</code> Fluent method-chaining data cleaning for pandas</summary>

<br>

Clean APIs for data cleaning with a fluent method-chaining interface for pandas DataFrames, inspired by the R Janitor package.

```
  Score     63/100
  Stars     ⭐ 1,488 (+5 last 30d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      cleaning-data · data · data-engineering · dataframe · hacktoberfest
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Data Labeling

*Programmatic and semi-automated tools for labeling training data, including weak supervision and active learning.*

<details><summary>🟢 🥇 <b><a href="https://github.com/HumanSignal/label-studio">Label Studio</a></b> <code>⭐ 27.1K</code> <code>↗️ +335</code> <code>Apache-2.0</code> ML-assisted labeling for text, images, audio, video</summary>

<br>

Multi-type data labeling platform with ML-assisted annotation and LLM integration for text, images, audio, and video.

```
  Score     77/100
  Stars     ⭐ 27,128 (+335 last 30d, +75 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      annotation · annotation-tool · annotations · boundingbox · computer-vision
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/CVHub520/X-AnyLabeling">X-AnyLabeling</a></b> <code>⭐ 8.9K</code> <code>↗️ +368</code> <code>GPL-3.0</code> SAM-powered annotation for auto-segmentation and detection</summary>

<br>

AI-assisted annotation with Segment Anything and other foundation models for automatic segmentation, detection, and classification pre-labeling.

```
  Score     76/100
  Stars     ⭐ 8,874 (+368 last 30d, +80 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   GPL-3.0
  Tags      artificial-intelligence · clip · computer-vision · deep-learning · groundingdino
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/argilla-io/argilla">Argilla</a></b> <code>⭐ 4.9K</code> <code>↗️ +45</code> <code>Apache-2.0</code> Collaborative human and AI feedback for LLM development</summary>

<br>

Collaboration platform for collecting and managing human and AI feedback for NLP and LLM development.

```
  Score     70/100
  Stars     ⭐ 4,943 (+45 last 30d, +9 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2025
  License   Apache-2.0
  Tags      active-learning · ai · annotation-tool · developer-tools · gpt-4
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/argilla-io/distilabel">Distilabel</a></b> <code>⭐ 3.2K</code> <code>↗️ +53</code> <code>Apache-2.0</code> Synthetic data generation with Self-Instruct and EvolInstruct</summary>

<br>

Framework for synthetic data generation, AI feedback, and instruction tuning using Self-Instruct and EvolInstruct techniques.

```
  Score     69/100
  Stars     ⭐ 3,189 (+53 last 30d, +11 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Jan 2025
  License   Apache-2.0
  Tags      ai · huggingface · llms · openai · python
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/snorkel-team/snorkel">Snorkel</a></b> <code>⭐ 6.0K</code> <code>↗️ +17</code> <code>Apache-2.0</code> Write labeling functions instead of hand-labeling data</summary>

<br>

Programmatic labeling via weak supervision - write labeling functions instead of hand-labeling.

```
  Score     68/100
  Stars     ⭐ 5,956 (+17 last 30d, +3 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Feb 2024
  License   Apache-2.0
  Tags      ai · data-augmentation · data-science · data-slicing · labeling
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/opendatalab/labelU">LabelU</a></b> <code>⭐ 1.6K</code> <code>↗️ +35</code> <code>Apache-2.0</code> Multi-modal annotation for image, audio, and video</summary>

<br>

Multi-modal annotation toolbox supporting image, audio, and video with configurable templates and collaborative labeling workflows.

```
  Score     68/100
  Stars     ⭐ 1,554 (+35 last 30d, +10 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      annotation · audio · computer-vision · data-labeling · image
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/cleanlab/cleanlab">Cleanlab</a></b> <code>⭐ 11.4K</code> <code>↗️ +63</code> <code>Apache-2.0</code> Automatically find and fix label errors in datasets</summary>

<br>

Data-centric AI toolkit for finding and fixing label errors, outliers, and data quality issues automatically.

```
  Score     66/100
  Stars     ⭐ 11,441 (+63 last 30d, +7 last 7d)
  Activity  🟢 Jan 2026
  Release   📦 Jan 2026
  License   Apache-2.0
  Tags      active-learning · annotation · anomaly-detection · data-annotation · data-centric-ai
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/HumanSignal/Adala">Adala</a></b> <code>⭐ 1.4K</code> <code>↗️ +22</code> <code>Apache-2.0</code> Autonomous LLM agent iteratively improving labeling quality</summary>

<br>

Autonomous data labeling agent that uses LLMs to label data, learn from ground truth, and iteratively improve labeling quality (Label Studio team).

```
  Score     66/100
  Stars     ⭐ 1,423 (+22 last 30d, 0 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Nov 2023
  License   Apache-2.0
  Tags      agent · agent-based-framework · agent-oriented-programming · autonomous-agents · gpt-4
```

</details>

<details><summary>🟡 <b>9</b> <b><a href="https://github.com/autodistill/autodistill">Autodistill</a></b> <code>⭐ 2.7K</code> <code>↗️ +24</code> <code>Apache-2.0</code> Distill foundation models into task-specific labelers</summary>

<br>

Automated image labeling by distilling foundation model knowledge into smaller task-specific models (Roboflow).

```
  Score     55/100
  Stars     ⭐ 2,674 (+24 last 30d, +10 last 7d)
  Activity  🟡 May 2025
  Release   📦 Feb 2024
  License   Apache-2.0
  Tags      auto-labeling · computer-vision · deep-learning · foundation-models · grounding-dino
```

</details>


**[⬆ Back to Contents](#contents)**

## Synthetic Data Generation

*Automated creation of artificial training data that preserves statistical properties of real datasets, with optional privacy guarantees.*

<details><summary>🟢 🥇 <b><a href="https://github.com/NVIDIA-NeMo/DataDesigner">NeMo Data Designer</a></b> <code>⭐ 1.7K</code> <code>↗️ +797</code> <code>Apache-2.0</code> Generates and evaluates synthetic data for LLM pipelines</summary>

<br>

Generates high-quality synthetic data from scratch or seed data with built-in evaluation and quality control for LLM training pipelines (NVIDIA).

```
  Score     77/100
  Stars     ⭐ 1,692 (+797 last 30d, +55 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agentic-ai · data-augmentation · data-generation · llm · mcp
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/bespokelabsai/curator">Curator</a></b> <code>⭐ 1.7K</code> <code>↗️ +21</code> <code>Apache-2.0</code> Pipeline synthetic data curation with LLM quality filtering</summary>

<br>

Pipeline-oriented synthetic data curation for post-training and structured data extraction with built-in quality filtering from LLMs.

```
  Score     66/100
  Stars     ⭐ 1,669 (+21 last 30d, +6 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      agents · deep-learning · fine-tuning · instruction-tuning · llm
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/sdv-dev/SDV">SDV</a></b> <code>⭐ 3.5K</code> <code>↗️ +30</code> <code>NOASSERTION</code> Synthetic tabular data vault with multiple generative models</summary>

<br>

Synthetic Data Vault with multiple generative models (GaussianCopula, CTGAN, TVAE) for single-table, multi-table, and sequential data.

```
  Score     65/100
  Stars     ⭐ 3,474 (+30 last 30d, +3 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      data-generation · deep-learning · gan · gans · generative-adversarial-network
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/hitsz-ids/synthetic-data-generator">SDG</a></b> <code>⭐ 2.4K</code> <code>Apache-2.0</code> Synthetic tabular data preserving statistical distributions</summary>

<br>

Framework for generating high-quality synthetic tabular data preserving statistical distributions and correlations.

```
  Score     65/100
  Stars     ⭐ 2,416 (+6 last 30d, +3 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2024
  License   Apache-2.0
  Tags      agent · data-generator · deep-learning · gan · generative-ai
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/meta-llama/synthetic-data-kit">Synthetic Data Kit</a></b> <code>⭐ 1.6K</code> <code>↗️ +34</code> <code>MIT</code> LLM-generated training data at scale for fine-tuning</summary>

<br>

Toolkit for generating high-quality synthetic datasets to fine-tune models with LLM-generated training data at scale (Meta).

```
  Score     59/100
  Stars     ⭐ 1,574 (+34 last 30d, +2 last 7d)
  Activity  🟢 Oct 2025
  License   MIT
  Tags      data · generation · llm · python · synthetic
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/datadreamer-dev/DataDreamer">DataDreamer</a></i> <code>⭐ 1.1K</code> <code>MIT</code> Reproducible LLM pipelines for synthetic data and training</summary>

<br>

*Reproducible LLM workflows for prompting, synthetic data generation, and model training in one pipeline. **Unmaintained - no commits for 12+ months.***

```
  Score     51/100
  Stars     ⭐ 1,115 (n/a)
  Activity  🔴 Feb 2025 - unmaintained 12+ months
  Release   📦 Feb 2025
  License   MIT
  Tags      alignment · deep-learning · fine-tuning · gpt · instruction-tuning
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Model Compression

*Automated quantization, pruning, distillation, and low-rank compression for efficient inference.*

<details><summary>🟢 🥇 <b><a href="https://github.com/vllm-project/llm-compressor">LLM Compressor</a></b> <code>⭐ 3.2K</code> <code>↗️ +236</code> <code>Apache-2.0</code> Transformers-compatible compression optimized for vLLM</summary>

<br>

Transformers-compatible compression library optimized for efficient vLLM inference.

```
  Score     79/100
  Stars     ⭐ 3,151 (+236 last 30d, +42 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      compression · quantization
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/NVIDIA/Model-Optimizer">NVIDIA TensorRT Model Optimizer</a></b> <code>⭐ 2.6K</code> <code>↗️ +328</code> <code>Apache-2.0</code> Quantization and pruning optimized for TensorRT and vLLM</summary>

<br>

Quantization, pruning, distillation, and speculative decoding optimized for TensorRT and vLLM deployment.

```
  Score     78/100
  Stars     ⭐ 2,564 (+328 last 30d, +55 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      deep-learning · distillation · inference · model-compression · nvidia
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/bitsandbytes-foundation/bitsandbytes">bitsandbytes</a></b> <code>⭐ 8.2K</code> <code>↗️ +95</code> <code>MIT</code> De facto 4-bit and 8-bit LLM quantization for PyTorch</summary>

<br>

De facto standard for k-bit quantization of LLMs in PyTorch - enables 4-bit and 8-bit inference and training, the backbone for QLoRA.

```
  Score     72/100
  Stars     ⭐ 8,156 (+95 last 30d, +29 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Feb 2026
  License   MIT
  Tags      llm · machine-learning · pytorch · qlora · quantization
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/ModelCloud/GPTQModel">GPTQModel</a></b> <code>⭐ 1.1K</code> <code>↗️ +58</code> <code>NOASSERTION</code> LLM quantization for CUDA, ROCm, and Apple Silicon</summary>

<br>

LLM quantization toolkit with support for NVIDIA CUDA, AMD ROCm, Intel, and Apple Silicon backends.

```
  Score     68/100
  Stars     ⭐ 1,121 (+58 last 30d, +8 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      gptq · optimum · peft · quantization · sglang
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/microsoft/Olive">Olive</a></b> <code>⭐ 2.3K</code> <code>↗️ +27</code> <code>MIT</code> End-to-end model optimization for CPU, GPU, and NPU</summary>

<br>

End-to-end model optimization automating fine-tuning, conversion, quantization, and graph optimization for CPUs, GPUs, and NPUs (Microsoft).

```
  Score     68/100
  Stars     ⭐ 2,301 (+27 last 30d, +5 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      deep-learning · fine-tuning · inference · microsoft · model-compression
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/intel/neural-compressor">Intel Neural Compressor</a></b> <code>⭐ 2.6K</code> <code>↗️ +22</code> <code>Apache-2.0</code> Unified quantization and pruning across PyTorch and ONNX</summary>

<br>

Unified quantization, sparsity, pruning, and distillation across PyTorch, TensorFlow, and ONNX (Intel).

```
  Score     67/100
  Stars     ⭐ 2,622 (+22 last 30d, +5 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      auto-tuning · awq · fp4 · gptq · int4
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/huggingface/optimum">Optimum</a></b> <code>⭐ 3.4K</code> <code>↗️ +26</code> <code>Apache-2.0</code> Hardware-optimized Transformers inference and quantization</summary>

<br>

Toolkit for accelerating Transformers inference with hardware-optimized quantization, pruning, and graph optimization for ONNX Runtime, OpenVINO, and more (Hugging Face).

```
  Score     67/100
  Stars     ⭐ 3,361 (+26 last 30d, +4 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      graphcore · habana · inference · intel · onnx
```

</details>

<details><summary>🟡 <b>8</b> <b><a href="https://github.com/mit-han-lab/llm-awq">LLM-AWQ</a></b> <code>⭐ 3.5K</code> <code>↗️ +47</code> <code>MIT</code> Lossless 4-bit LLM quantization via activation awareness</summary>

<br>

Activation-aware weight quantization achieving lossless 4-bit compression for LLMs (MIT HAN Lab, MLSys 2024 Best Paper).

```
  Score     58/100
  Stars     ⭐ 3,511 (+47 last 30d, +9 last 7d)
  Activity  🟡 Jul 2025
  License   MIT
  Tags      awq · deep-learning · inference · llm · model-compression
```

</details>

<details><summary>🟡 <b>9</b> <b><a href="https://github.com/VainF/Torch-Pruning">Torch-Pruning</a></b> <code>⭐ 3.3K</code> <code>↗️ +24</code> <code>MIT</code> Structural pruning for any PyTorch model</summary>

<br>

Structural pruning framework for any PyTorch model including LLMs, YOLO, ViT, and diffusion models (CVPR 2023).

```
  Score     57/100
  Stars     ⭐ 3,295 (+24 last 30d, +4 last 7d)
  Activity  🟡 Sep 2025
  Release   📦 Sep 2025
  License   MIT
  Tags      efficient-deep-learning · llm · model-compression · pruning · transformers
```

</details>


**[⬆ Back to Contents](#contents)**

## MLOps and Experiment Tracking

*Platforms for managing the ML lifecycle - experiment tracking, model registry, pipeline orchestration, and feature stores.*

<details><summary>🟢 🥇 <b><a href="https://github.com/langfuse/langfuse">Langfuse</a></b> <code>⭐ 26.0K</code> <code>↗️ +2335</code> <code>NOASSERTION</code> Open-source LLM tracing, evals, and prompt management</summary>

<br>

Open-source LLM engineering platform with tracing, evaluations, prompt management, and cost analytics.

```
  Score     83/100
  Stars     ⭐ 26,014 (+2335 last 30d, +920 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      analytics · autogen · evaluation · langchain · large-language-models
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/mlflow/mlflow">MLflow</a></b> <code>⭐ 25.5K</code> <code>↗️ +663</code> <code>Apache-2.0</code> End-to-end ML lifecycle with experiment tracking and registry</summary>

<br>

End-to-end ML lifecycle platform with experiment tracking, model registry, and integrated prompt optimization.

```
  Score     79/100
  Stars     ⭐ 25,538 (+663 last 30d, +115 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agentops · agents · ai · ai-governance · apache-spark
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/comet-ml/opik">Opik</a></b> <code>⭐ 19.0K</code> <code>↗️ +601</code> <code>Apache-2.0</code> LLM debugging, evaluation, and quality dashboards</summary>

<br>

LLM debugging, evaluation, and monitoring platform with detailed tracing and quality dashboards (Comet).

```
  Score     79/100
  Stars     ⭐ 19,027 (+601 last 30d, +139 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      evaluation · hacktoberfest · hacktoberfest2025 · langchain · llama-index
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/ray-project/ray">Ray</a></b> <code>⭐ 42.3K</code> <code>↗️ +555</code> <code>Apache-2.0</code> Distributed HPO at scale for any ML framework</summary>

<br>

Unified AI compute engine for distributed training, tuning, and model serving with Ray Train, Ray Tune, and Ray Serve.

```
  Score     78/100
  Stars     ⭐ 42,295 (+555 last 30d, +116 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      data-science · deep-learning · deployment · distributed · hyperparameter-optimization
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/PrefectHQ/prefect">Prefect</a></b> <code>⭐ 22.2K</code> <code>↗️ +316</code> <code>Apache-2.0</code> Modern data workflow automation with retries and caching</summary>

<br>

Modern data workflow automation with retries, caching, and real-time logging.

```
  Score     76/100
  Stars     ⭐ 22,243 (+316 last 30d, +48 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      automation · data · data-engineering · data-ops · data-science
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/dagster-io/dagster">Dagster</a></b> <code>⭐ 15.4K</code> <code>↗️ +247</code> <code>Apache-2.0</code> Asset-centric ML pipeline orchestration with lineage tracking</summary>

<br>

Asset-centric orchestration built for ML pipelines with data lineage tracking and observability.

```
  Score     75/100
  Stars     ⭐ 15,379 (+247 last 30d, +38 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      analytics · dagster · data-engineering · data-integration · data-orchestrator
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/Arize-ai/phoenix">Phoenix</a></b> <code>⭐ 9.4K</code> <code>↗️ +408</code> <code>NOASSERTION</code> OpenTelemetry-native AI observability and LLM evaluation</summary>

<br>

AI observability platform with OpenTelemetry-native tracing and LLM evaluation dashboards (Arize).

```
  Score     74/100
  Stars     ⭐ 9,414 (+408 last 30d, +92 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      agents · ai-monitoring · ai-observability · aiengineering · anthropic
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/feast-dev/feast">Feast</a></b> <code>⭐ 7.0K</code> <code>↗️ +161</code> <code>Apache-2.0</code> Open-source feature store for real-time and batch ML</summary>

<br>

Open-source feature store for managing and serving ML features in real-time and batch inference.

```
  Score     74/100
  Stars     ⭐ 6,980 (+161 last 30d, +9 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      big-data · data-engineering · data-quality · data-science · feature-store
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/treeverse/dvc">DVC</a></b> <code>⭐ 15.6K</code> <code>↗️ +102</code> <code>Apache-2.0</code> Git-like version control for data and ML models</summary>

<br>

Version control for data and models with built-in experiment tracking and pipeline management.

```
  Score     73/100
  Stars     ⭐ 15,562 (+102 last 30d, +13 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      ai · data-science · data-version-control · developer-tools · machine-learning
```

</details>

<details><summary>🟢 <b>10</b> <b><a href="https://github.com/wandb/wandb">W&B</a></b> <code>⭐ 11.0K</code> <code>↗️ +106</code> <code>MIT</code> Experiment tracking and visualization for ML teams</summary>

<br>

Experiment tracking, visualization, and collaboration platform for ML teams (Weights and Biases).

```
  Score     73/100
  Stars     ⭐ 11,028 (+106 last 30d, +19 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      ai · collaboration · data-science · data-versioning · deep-learning
```

</details>

<details><summary>🟢 <b>11</b> <b><a href="https://github.com/Netflix/metaflow">Metaflow</a></b> <code>⭐ 10.1K</code> <code>↗️ +100</code> <code>Apache-2.0</code> Human-centric framework for real-life ML projects at scale</summary>

<br>

Human-centric framework for managing real-life data science and ML projects at scale (Netflix).

```
  Score     73/100
  Stars     ⭐ 10,054 (+100 last 30d, +11 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      agents · ai · aws · azure · cost-optimization
```

</details>

<details><summary>🟢 <b>12</b> <b><a href="https://github.com/kedro-org/kedro">Kedro</a></b> <code>⭐ 10.9K</code> <code>↗️ +68</code> <code>Apache-2.0</code> Reproducible, maintainable ML pipelines with clean patterns</summary>

<br>

Framework for reproducible, maintainable ML pipelines with clean coding patterns.

```
  Score     72/100
  Stars     ⭐ 10,851 (+68 last 30d, +18 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      experiment-tracking · hacktoberfest · kedro · machine-learning · machine-learning-engineering
```

</details>

<details><summary>🟢 <b>13</b> <b><a href="https://github.com/clearml/clearml">ClearML</a></b> <code>⭐ 6.6K</code> <code>↗️ +59</code> <code>Apache-2.0</code> Unified experiment manager and pipeline orchestrator</summary>

<br>

Unified experiment manager, pipeline orchestrator, and data/model management platform.

```
  Score     71/100
  Stars     ⭐ 6,647 (+59 last 30d, +12 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      ai · clearml · control · deep-learning · deeplearning
```

</details>

<details><summary>🟢 <b>14</b> <b><a href="https://github.com/aimhubio/aim">Aim</a></b> <code>⭐ 6.1K</code> <code>↗️ +51</code> <code>Apache-2.0</code> Self-hosted experiment tracker for 10,000+ training runs</summary>

<br>

Self-hosted experiment tracker with a high-performance UI that handles 10,000+ training runs.

```
  Score     71/100
  Stars     ⭐ 6,100 (+51 last 30d, +7 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 May 2025
  License   Apache-2.0
  Tags      ai · data-science · data-visualization · experiment-tracking · machine-learning
```

</details>

<details><summary>🟢 <b>15</b> <b><a href="https://github.com/zenml-io/zenml">ZenML</a></b> <code>⭐ 5.4K</code> <code>↗️ +72</code> <code>Apache-2.0</code> Portable production-ready ML pipelines on any infrastructure</summary>

<br>

Framework for building portable, production-ready ML pipelines that run on any infrastructure.

```
  Score     71/100
  Stars     ⭐ 5,356 (+72 last 30d, +14 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      agentops · agents · ai · automl · data-science
```

</details>

<details><summary>🟢 <b>16</b> <b><a href="https://github.com/kubeflow/kubeflow">Kubeflow</a></b> <code>⭐ 15.6K</code> <code>↗️ +84</code> <code>Apache-2.0</code> Kubernetes ML toolkit for portable scalable pipelines</summary>

<br>

ML toolkit on Kubernetes for building portable, scalable ML pipelines and training workflows.

```
  Score     67/100
  Stars     ⭐ 15,599 (+84 last 30d, +18 last 7d)
  Activity  🟢 Jan 2026
  Release   📦 Mar 2025
  License   Apache-2.0
  Tags      google-kubernetes-engine · jupyter · kubeflow · kubernetes · machine-learning
```

</details>


**[⬆ Back to Contents](#contents)**

## Model Serving

*General-purpose model serving, packaging, and inference infrastructure for ML, DL, and multi-framework deployments.*

<details><summary>🟢 🥇 <b><a href="https://github.com/microsoft/onnxruntime">ONNX Runtime</a></b> <code>⭐ 20.3K</code> <code>↗️ +678</code> <code>MIT</code> Cross-platform inference accelerator via ONNX format</summary>

<br>

Cross-platform inference accelerator supporting PyTorch, TensorFlow, scikit-learn, and XGBoost via the ONNX format (Microsoft).

```
  Score     79/100
  Stars     ⭐ 20,305 (+678 last 30d, +415 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      ai-framework · deep-learning · hardware-acceleration · machine-learning · neural-networks
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/openvinotoolkit/openvino">OpenVINO</a></b> <code>⭐ 10.1K</code> <code>↗️ +203</code> <code>Apache-2.0</code> Intel inference optimization for CPU, GPU, and edge</summary>

<br>

Inference optimization and deployment toolkit for CPUs, GPUs, and edge accelerators (Intel).

```
  Score     74/100
  Stars     ⭐ 10,137 (+203 last 30d, +39 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ai · computer-vision · deep-learning · deploy-ai · diffusion-models
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a></b> <code>⭐ 10.6K</code> <code>↗️ +144</code> <code>BSD-3-Clause</code> Multi-framework inference server for production deployment</summary>

<br>

Multi-framework inference serving for TensorRT, PyTorch, ONNX, and custom backends (NVIDIA).

```
  Score     73/100
  Stars     ⭐ 10,603 (+144 last 30d, +23 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   BSD-3-Clause
  Tags      cloud · datacenter · deep-learning · edge · gpu
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/replicate/cog">Cog</a></b> <code>⭐ 9.4K</code> <code>↗️ +134</code> <code>Apache-2.0</code> Package ML models as Docker containers with auto APIs</summary>

<br>

Package ML models as standard Docker containers with auto-generated HTTP APIs and GPU setup for reproducible, portable deployment (Replicate).

```
  Score     73/100
  Stars     ⭐ 9,401 (+134 last 30d, +9 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ai · containers · cuda · docker · machine-learning
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/kserve/kserve">KServe</a></b> <code>⭐ 5.4K</code> <code>↗️ +118</code> <code>Apache-2.0</code> Kubernetes-native model serving with canary rollouts</summary>

<br>

Kubernetes-native standardized model serving with canary rollouts, autoscaling, and multi-framework support (CNCF Incubating).

```
  Score     72/100
  Stars     ⭐ 5,381 (+118 last 30d, +38 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   Apache-2.0
  Tags      artificial-intelligence · cncf · genai · hacktoberfest · istio
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/bentoml/BentoML">BentoML</a></b> <code>⭐ 8.6K</code> <code>↗️ +67</code> <code>Apache-2.0</code> Python framework for production inference APIs and pipelines</summary>

<br>

Build production-ready inference APIs, batch jobs, and multi-model pipelines with unified Python framework.

```
  Score     71/100
  Stars     ⭐ 8,598 (+67 last 30d, +12 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      ai-inference · deep-learning · generative-ai · inference-platform · llm
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/pytorch/executorch">ExecuTorch</a></b> <code>⭐ 4.5K</code> <code>↗️ +117</code> <code>NOASSERTION</code> On-device AI inference with 50KB runtime footprint</summary>

<br>

On-device AI inference for mobile, embedded, and edge platforms with a 50KB base runtime footprint (Meta).

```
  Score     68/100
  Stars     ⭐ 4,539 (+117 last 30d, +15 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      deep-learning · embedded · gpu · machine-learning · mobile
```

</details>

<details><summary>🟢 <b>8</b> <b><a href="https://github.com/Lightning-AI/LitServe">LitServe</a></b> <code>⭐ 3.9K</code> <code>↗️ +38</code> <code>Apache-2.0</code> Minimal high-performance Python AI serving framework</summary>

<br>

Minimal, high-performance Python framework for AI model serving (Lightning AI).

```
  Score     68/100
  Stars     ⭐ 3,873 (+38 last 30d, +10 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Dec 2025
  License   Apache-2.0
  Tags      ai · api · artificial-intelligence · deep-learning · developer-tools
```

</details>

<details><summary>🟢 <b>9</b> <b><a href="https://github.com/tensorflow/tfx">TFX</a></b> <code>⭐ 2.2K</code> <code>Apache-2.0</code> End-to-end production ML pipeline platform from Google</summary>

<br>

End-to-end platform for deploying production ML pipelines with data validation, transformation, training, evaluation, and serving components (Google).

```
  Score     66/100
  Stars     ⭐ 2,182 (+6 last 30d, +1 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      apache-beam · machine-learning · tensorflow
```

</details>


**[⬆ Back to Contents](#contents)**

## LLM Inference Runtimes

*High-performance inference engines optimised specifically for serving large language models.*

<details><summary>🟢 🥇 <b><a href="https://github.com/ggml-org/llama.cpp">llama.cpp</a></b> <code>⭐ 106.3K</code> <code>↗️ +7372</code> <code>MIT</code> C/C++ LLM inference, foundation for local apps</summary>

<br>

LLM inference in C/C++ with broad hardware support - the foundation for most local LLM applications.

```
  Score     92/100
  Stars     ⭐ 106,276 (+7372 last 30d, +1987 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      ggml
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/vllm-project/vllm">vLLM</a></b> <code>⭐ 78.0K</code> <code>↗️ +3921</code> <code>Apache-2.0</code> High-throughput PagedAttention engine for production LLMs</summary>

<br>

High-throughput LLM serving engine with PagedAttention, powering most open-source LLM deployments in production.

```
  Score     87/100
  Stars     ⭐ 78,026 (+3921 last 30d, +923 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      amd · blackwell · cuda · deepseek · deepseek-v3
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/ollama/ollama">Ollama</a></b> <code>⭐ 169.9K</code> <code>↗️ +4358</code> <code>MIT</code> Docker-like local LLM runner for fast prototyping</summary>

<br>

Docker-like local LLM runner for getting models up and running quickly for prototyping.

```
  Score     86/100
  Stars     ⭐ 169,902 (+4358 last 30d, +633 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   MIT
  Tags      deepseek · gemma · gemma3 · glm · go
```

</details>

<details><summary>🟢 <b>4</b> <b><a href="https://github.com/sgl-project/sglang">SGLang</a></b> <code>⭐ 26.4K</code> <code>↗️ +1545</code> <code>Apache-2.0</code> High-performance LLM serving with constrained decoding</summary>

<br>

High-performance LLM serving framework powering 400K+ GPUs with best-in-class structured and constrained decoding.

```
  Score     85/100
  Stars     ⭐ 26,370 (+1545 last 30d, +375 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      attention · blackwell · cuda · deepseek · diffusion
```

</details>

<details><summary>🟢 <b>5</b> <b><a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a></b> <code>⭐ 13.5K</code> <code>↗️ +304</code> <code>NOASSERTION</code> NVIDIA's high-performance LLM inference with custom kernels</summary>

<br>

High-performance LLM inference library with custom attention kernels, speculative decoding, and MoE support (NVIDIA).

```
  Score     72/100
  Stars     ⭐ 13,466 (+304 last 30d, +66 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   NOASSERTION
  Tags      blackwell · cuda · llm-serving · moe · pytorch
```

</details>

<details><summary>🟢 <b>6</b> <b><a href="https://github.com/InternLM/lmdeploy">LMDeploy</a></b> <code>⭐ 7.8K</code> <code>↗️ +107</code> <code>Apache-2.0</code> Compress, deploy, and serve LLMs and vision models</summary>

<br>

Toolkit for compressing, deploying, and serving large language and vision-language models.

```
  Score     72/100
  Stars     ⭐ 7,810 (+107 last 30d, +26 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Apr 2026
  License   Apache-2.0
  Tags      codellama · cuda-kernels · deepspeed · fastertransformer · internlm
```

</details>

<details><summary>🟢 <b>7</b> <b><a href="https://github.com/ModelTC/LightLLM">LightLLM</a></b> <code>⭐ 4.0K</code> <code>↗️ +62</code> <code>Apache-2.0</code> Lightweight LLM serving with continuous batching</summary>

<br>

Lightweight LLM inference and serving framework with continuous batching, tensor parallelism, and efficient memory management.

```
  Score     70/100
  Stars     ⭐ 4,024 (+62 last 30d, +8 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Sep 2025
  License   Apache-2.0
  Tags      deep-learning · gpt · llama · llm · model-serving
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

<details><summary>🟢 🥇 <b><a href="https://github.com/josephmisiti/awesome-machine-learning">awesome-machine-learning</a></b> <code>⭐ 72.3K</code> <code>↗️ +407</code> <code>NOASSERTION</code> ML frameworks and libraries organized by language</summary>

<br>

Curated list of ML frameworks, libraries, and software organized by language.

```
  Score     75/100
  Stars     ⭐ 72,282 (+407 last 30d, +45 last 7d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      awesome · awesome-list · curated-list · deep-learning · frameworks
```

</details>

<details><summary>🟢 🥈 <b><a href="https://github.com/EthicalML/awesome-production-machine-learning">awesome-production-machine-learning</a></b> <code>⭐ 20.4K</code> <code>↗️ +171</code> <code>MIT</code> Tools for deploying and scaling ML in production</summary>

<br>

Curated list of tools for deploying, monitoring, and scaling ML in production.

```
  Score     75/100
  Stars     ⭐ 20,438 (+171 last 30d, +28 last 7d)
  Activity  🟢 Apr 2026
  Release   📦 Mar 2026
  License   MIT
  Tags      awesome · awesome-list · data-mining · deep-learning · explainability
```

</details>

<details><summary>🟢 🥉 <b><a href="https://github.com/steven2358/awesome-generative-ai">awesome-generative-ai</a></b> <code>⭐ 11.9K</code> <code>↗️ +268</code> <code>CC0-1.0</code> Modern generative AI projects and services curated</summary>

<br>

Curated list of modern generative AI projects and services.

```
  Score     75/100
  Stars     ⭐ 11,898 (+268 last 30d, +46 last 7d)
  Activity  🟢 Apr 2026
  License   CC0-1.0
  Tags      ai · artificial-intelligence · awesome · awesome-list · generative-ai
```

</details>

<details><summary>🟡 <b>4</b> <b><a href="https://github.com/Hannibal046/Awesome-LLM">awesome-llm</a></b> <code>⭐ 26.7K</code> <code>↗️ +208</code> <code>CC0-1.0</code> LLM resources covering papers, tools, and applications</summary>

<br>

Curated list of large language model resources covering papers, tools, and applications.

```
  Score     64/100
  Stars     ⭐ 26,686 (+208 last 30d, +31 last 7d)
  Activity  🟡 Jul 2025
  License   CC0-1.0
  Tags      awesome · awesome-list · curated-list · deep-learning · large-language-models
```

</details>

<details><summary>🟡 <b>5</b> <b><a href="https://github.com/ChristosChristofidis/awesome-deep-learning">awesome-deep-learning</a></b> <code>⭐ 28.0K</code> <code>↗️ +230</code> Deep learning tutorials, projects, and communities</summary>

<br>

Curated list of deep learning tutorials, projects, and communities.

```
  Score     55/100
  Stars     ⭐ 27,953 (+230 last 30d, +34 last 7d)
  Activity  🟡 May 2025
  License   -
  Tags      awesome · awesome-list · deep-learning · deep-learning-tutorial · deep-networks
```

</details>

---

<details><summary>🔴 💤 <i><a href="https://github.com/visenger/awesome-mlops">awesome-mlops</a></i> <code>⭐ 13.9K</code> MLOps tools and best practices for production ML</summary>

<br>

*Curated list of MLOps tools and best practices for production ML. **Unmaintained - no commits for 12+ months.***

```
  Score     51/100
  Stars     ⭐ 13,872 (n/a)
  Activity  🔴 Nov 2024 - unmaintained 12+ months
  License   -
  Tags      ai · data-science · devops · engineering · federated-learning
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
