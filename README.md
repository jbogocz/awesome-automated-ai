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
| :green_circle: :yellow_circle: :red_circle: | Project health: active (< 6 months) / stale (6-12 months) / unmaintained (> 12 months) |
| **88** | Quality score (0-100) based on stars, trend, freshness, license, and archived status |
| :1st_place_medal: :2nd_place_medal: :3rd_place_medal: | Top 3 quality score per category |
| :star: 11.7K | GitHub stars |
| :arrow_upper_right: +340 | Stars gained in last 30 days (shown when >= 10) |
| :zzz: | Unmaintained - no activity for 12+ months |
| :file_cabinet: | Historical - included for foundational influence |
| `Apache-2.0` | SPDX license identifier |

> Click any project to expand its full dashboard with quality bar, exact stats, and tags.

## General-Purpose AutoML

*End-to-end frameworks that automate model selection, hyperparameter tuning, and pipeline construction.*

<details><summary>🟢 <b>68</b> 🥇 <b><a href="https://github.com/ludwig-ai/ludwig">Ludwig</a></b> <code>⭐ 11.7K</code> <code>Apache-2.0</code> Declarative deep learning framework supporting custom model</summary>

<br>

Declarative deep learning framework supporting custom model building and LLM fine-tuning via YAML configs. Now under Linux Foundation AI & Data.

```
  Quality   ██████▓░░░  68/100
  Stars     ⭐ 11,665 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      computer-vision · data-centric · data-science · deep · deep-learning · deeplearning · fine-tuning · learning · llama · llama2 · llm · llm-training · machine-learning · machinelearning · mistral · ml · natural-language · natural-language-processing · neural-network · pytorch
```

</details>

<details><summary>🟢 <b>66</b> 🥈 <b><a href="https://github.com/h2oai/h2o-3">H2O AutoML</a></b> <code>⭐ 7.5K</code> <code>Apache-2.0</code> Distributed machine learning platform with automatic training</summary>

<br>

Distributed machine learning platform with automatic training and tuning of many models within a user-specified time limit.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 7,522 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      automl · big-data · data-science · deep-learning · distributed · ensemble-learning · gbm · gpu · h2o · h2o-automl · hadoop · java · machine-learning · naive-bayes · opensource · pca · python · r · random-forest · spark
```

</details>

<details><summary>🟢 <b>63</b> 🥉 <b><a href="https://github.com/shankarpandala/lazypredict">LazyPredict</a></b> <code>⭐ 3.3K</code> <code>MIT</code> Build and evaluate dozens of scikit-learn models</summary>

<br>

Build and evaluate dozens of scikit-learn models in a single line of code for rapid baseline comparison. **Low activity since 2022.**

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 3,308 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      automl · classification · machine-learning · regression
```

</details>

<details><summary>🟢 <b>63</b> <b><a href="https://github.com/mljar/mljar-supervised">MLJAR Supervised</a></b> <code>⭐ 3.3K</code> <code>MIT</code> Automated ML with automatic explanations, visualizations, and</summary>

<br>

Automated ML with automatic explanations, visualizations, and Markdown reports for every trained model.

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 3,251 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      automated-machine-learning · automl · automl-api · automl-python · catboost · data-science · decision-tree · ensemble · feature-engineering · hyper-parameters · hyperparameter-optimization · lightgbm · machine-learning · mljar · neural-network · random-forest · scikit-learn · xgboost
```

</details>

<details><summary>🟢 <b>61</b> <b><a href="https://github.com/autogluon/autogluon">AutoGluon</a></b> <code>⭐ 10.2K</code> <code>Apache-2.0</code> Multi-layer stack ensembling for tabular, text, image</summary>

<br>

Multi-layer stack ensembling for tabular, text, image, time-series, and multimodal data - won medals in 15/18 Kaggle tabular contests in 2024 (Amazon).

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 10,209 (+3 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      autogluon · automated-machine-learning · automl · computer-vision · data-science · deep-learning · ensemble-learning · forecasting · gluon · hyperparameter-optimization · machine-learning · natural-language-processing · object-detection · python · pytorch · scikit-learn · structured-data · tabular-data · time-series · transfer-learning
```

</details>

<details><summary>🟢 <b>61</b> <b><a href="https://github.com/keras-team/autokeras">AutoKeras</a></b> <code>⭐ 9.3K</code> <code>Apache-2.0</code> Neural architecture search for deep learning models</summary>

<br>

Neural architecture search for deep learning models built on top of Keras.

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 9,315 (-1 last 30d)
  Activity  🟢 Nov 2025
  License   Apache-2.0
  Tags      autodl · automated-machine-learning · automl · deep-learning · keras · machine-learning · neural-architecture-search · python · tensorflow
```

</details>

<details><summary>🟢 <b>61</b> <b><a href="https://github.com/microsoft/FLAML">FLAML</a></b> <code>⭐ 4.3K</code> <code>MIT</code> Fast and lightweight AutoML that finds good</summary>

<br>

Fast and lightweight AutoML that finds good models with minimal resources - often the best choice for resource-constrained environments (Microsoft).

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 4,320 (+1 last 30d)
  Activity  🟢 Jan 2026
  License   MIT
  Tags      automated-machine-learning · automl · classification · data-science · deep-learning · finetuning · hyperparam · hyperparameter-optimization · jupyter-notebook · machine-learning · natural-language-generation · natural-language-processing · python · random-forest · regression · scikit-learn · tabular-data · timeseries-forecasting · tuning
```

</details>

<details><summary>🟡 <b>57</b> <b><a href="https://github.com/EpistasisLab/tpot">TPOT</a></b> <code>⭐ 10.0K</code> <code>LGPL-3.0</code> Genetic programming-based pipeline optimizer that designs and</summary>

<br>

Genetic programming-based pipeline optimizer that designs and optimizes scikit-learn pipelines.

```
  Quality   █████▓░░░░  57/100
  Stars     ⭐ 10,047 (+0 last 30d)
  Activity  🟡 Jul 2025
  License   LGPL-3.0
  Tags      adsp · ag066833 · aiml · alzheimer · alzheimers · automated-machine-learning · automation · automl · data-science · feature-engineering · gradient-boosting · hyperparameter-optimization · machine-learning · model-selection · nia · parameter-tuning · python · random-forest · scikit-learn · u01ag066833
```

</details>

<details><summary>🟢 <b>56</b> <b><a href="https://github.com/sapientml/sapientml">SapientML</a></b> <code>⭐ 449</code> <code>Apache-2.0</code> Generative AutoML that synthesizes pipelines by learning</summary>

<br>

Generative AutoML that synthesizes pipelines by learning from a corpus of existing ML solutions.

```
  Quality   █████▓░░░░  56/100
  Stars     ⭐ 449 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      automated-machine-learning · automl · automl-products · automl-python · machine-learning · python
```

</details>

<details><summary>🟢 <b>54</b> <b><a href="https://github.com/sb-ai-lab/LightAutoML">LightAutoML</a></b> <code>⭐ 1.5K</code> <code>Apache-2.0</code> Fast and customizable AutoML framework with Kaggle-winning</summary>

<br>

Fast and customizable AutoML framework with Kaggle-winning performance (Sber AI Lab).

```
  Quality   █████░░░░░  54/100
  Stars     ⭐ 1,458 (+0 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      automated-machine-learning · automatic-machine-learning · automl · automl-algorithms · binary-classification · data-science · kaggle · lama · machine-learning · multiclass-classification · nlp · python · regression
```

</details>

---

<details><summary>🔴 <b>52</b> 💤 <i><a href="https://github.com/pycaret/pycaret">PyCaret</a></i> <code>⭐ 9.7K</code> <code>MIT</code> Low-code machine learning library that automates model</summary>

<br>

*Low-code machine learning library that automates model training, tuning, and deployment workflows in Python. **Unmaintained - no commits for 12+ months.***

```
  Quality   █████░░░░░  52/100
  Stars     ⭐ 9,738 (n/a)
  Activity  🔴 Apr 2024 - unmaintained 12+ months
  License   MIT
  Tags      anomaly-detection · citizen-data-scientists · classification · clustering · data-science · gpu · machine-learning · ml · pycaret · python · regression · time-series
```

</details>

<details><summary>🔴 <b>51</b> 💤 <i><a href="https://github.com/automl/auto-sklearn">auto-sklearn</a></i> <code>⭐ 8.1K</code> <code>BSD-3-Clause</code> Historically important AutoML toolkit using Bayesian optimization</summary>

<br>

*Historically important AutoML toolkit using Bayesian optimization, meta-learning, and ensemble construction. **Unmaintained since Sep 2022; broken on Python 3.10+.***

```
  Quality   █████░░░░░  51/100
  Stars     ⭐ 8,079 (n/a)
  Activity  🔴 Feb 2023 - unmaintained 12+ months
  License   BSD-3-Clause
  Tags      automated-machine-learning · automl · bayesian-optimization · hyperparameter-optimization · hyperparameter-search · hyperparameter-tuning · meta-learning · metalearning · scikit-learn · smac
```

</details>

<details><summary>🔴 <b>43</b> 💤 <i><a href="https://github.com/alteryx/evalml">EvalML</a></i> <code>⭐ 846</code> <code>BSD-3-Clause</code> AutoML library for building, optimizing, and evaluating</summary>

<br>

*AutoML library for building, optimizing, and evaluating ML pipelines with domain-specific objectives (Alteryx). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  43/100
  Stars     ⭐ 846 (n/a)
  Activity  🔴 Jun 2024 - unmaintained 12+ months
  License   BSD-3-Clause
  Tags      automl · data-science · feature-engineering · feature-selection · hyperparameter-tuning · machine-learning · model-selection · optimization
```

</details>

<details><summary>🔴 <b>36</b> 💤 <i><a href="https://github.com/amore-labs/gama">GAMA</a></i> <code>⭐ 103</code> <code>Apache-2.0</code> AutoML tool that generates optimized ML pipelines</summary>

<br>

*AutoML tool that generates optimized ML pipelines using genetic programming and Bayesian optimization (OpenML). **Unmaintained - no commits for 12+ months.***

```
  Quality   ███▓░░░░░░  36/100
  Stars     ⭐ 103 (n/a)
  Activity  🔴 Jun 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      automl · hyperparameter-optimization · research-tool
```

</details>

<details><summary>🔴 <b>30</b> 🗄️ <i><a href="https://github.com/automl/autoweka">Auto-WEKA</a></i> <code>⭐ 336</code> The original AutoML system (2013) combining algorithm</summary>

<br>

*The original AutoML system (2013) combining algorithm selection and HPO in WEKA. **Historical; Java-only, maintenance mode.***

```
  Quality   ███░░░░░░░  30/100
  Stars     ⭐ 336 (n/a)
  Activity  🔴 Mar 2022 - historical
  License   -
```

</details>


**[⬆ Back to Contents](#contents)**

## Foundation Models as AutoML

*Pretrained models that replace traditional pipeline-search AutoML with a single forward pass or zero-shot inference.*

<details><summary>🟢 <b>65</b> 🥇 <b><a href="https://github.com/PriorLabs/TabPFN">TabPFN</a></b> <code>⭐ 6.0K</code> <code>NOASSERTION</code> Tabular foundation model that matches tuned XGBoost</summary>

<br>

Tabular foundation model that matches tuned XGBoost in 2.8 seconds with a single forward pass - 100% win rate vs default XGBoost on datasets under 10K rows (Nature 2024, now v2.6 supporting up to 100K rows).

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 6,012 (+1 last 30d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      data-science · foundation-models · machine-learning · tabpfn · tabular-data
```

</details>

<details><summary>🟢 <b>59</b> 🥈 <b><a href="https://github.com/amazon-science/chronos-forecasting">Chronos</a></b> <code>⭐ 5.1K</code> <code>Apache-2.0</code> Pretrained time-series foundation model for zero-shot probabilistic</summary>

<br>

Pretrained time-series foundation model for zero-shot probabilistic forecasting on unseen data (Amazon).

```
  Quality   █████▓░░░░  59/100
  Stars     ⭐ 5,090 (+2 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      artificial-intelligence · forecasting · foundation-models · huggingface · huggingface-transformers · large-language-models · llm · machine-learning · pretrained-models · time-series · time-series-forecasting · timeseries · transformers
```

</details>

<details><summary>🟢 <b>58</b> 🥉 <b><a href="https://github.com/LAMDA-Tabular/TALENT">TALENT</a></b> <code>⭐ 835</code> <code>MIT</code> Comprehensive toolkit and benchmark for tabular learning</summary>

<br>

Comprehensive toolkit and benchmark for tabular learning covering 35+ deep methods across 300 datasets.

```
  Quality   █████▓░░░░  58/100
  Stars     ⭐ 835 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      tabular · tabular-data · tabular-data-benchmark · tabular-data-deep-learning · tabular-data-machine-learning · tabular-data-toolkit · tabular-methods
```

</details>

<details><summary>🟢 <b>55</b> <b><a href="https://github.com/soda-inria/tabicl">TabICL</a></b> <code>⭐ 717</code> <code>NOASSERTION</code> State-of-the-art tabular foundation model achieving 10x faster</summary>

<br>

State-of-the-art tabular foundation model achieving 10x faster inference than TabPFN v2.5 (ICML 2025).

```
  Quality   █████▓░░░░  55/100
  Stars     ⭐ 717 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   NOASSERTION
  Tags      deep-learning · foundation-models · machine-learning · tabular-data · tabular-methods · tabular-model
```

</details>

<details><summary>🟢 <b>54</b> <b><a href="https://github.com/SalesforceAIResearch/uni2ts">Moirai</a></b> <code>⭐ 1.5K</code> <code>Apache-2.0</code> Universal time-series forecasting transformer supporting multivariate forecasting</summary>

<br>

Universal time-series forecasting transformer supporting multivariate forecasting unlike most competitors. Moirai-MoE released Oct 2024 (Salesforce).

```
  Quality   █████░░░░░  54/100
  Stars     ⭐ 1,463 (+0 last 30d)
  Activity  🟢 Nov 2025
  License   Apache-2.0
  Tags      deep-learning · forecasting · machine-learning · pre-trained-models · pre-training · representation-learning · time-series · time-series-forecasting · transformers · universal-forecasting
```

</details>

<details><summary>🟡 <b>49</b> <b><a href="https://github.com/yandex-research/tabm">TabM</a></b> <code>⭐ 987</code> <code>Apache-2.0</code> Parameter-efficient ensemble of MLPs based on BatchEnsemble</summary>

<br>

Parameter-efficient ensemble of MLPs based on BatchEnsemble, achieving top performance among tabular deep learning models without attention complexity (ICLR 2025, Yandex).

```
  Quality   ████▓░░░░░  49/100
  Stars     ⭐ 987 (+1 last 30d)
  Activity  🟡 Aug 2025
  License   Apache-2.0
```

</details>

<details><summary>🟡 <b>42</b> <b><a href="https://github.com/soda-inria/carte">CARTE</a></b> <code>⭐ 169</code> <code>BSD-3-Clause</code> Context-aware tabular representation using pretrained language models</summary>

<br>

Context-aware tabular representation using pretrained language models for data with heterogeneous columns.

```
  Quality   ████░░░░░░  42/100
  Stars     ⭐ 169 (+1 last 30d)
  Activity  🟡 Aug 2025
  License   BSD-3-Clause
  Tags      classification · data-science · graph-transformer · machine-learning · regression · transformers
```

</details>

---

<details><summary>🔴 <b>58</b> 💤 <i><a href="https://github.com/google-research/timesfm">TimesFM</a></i> <code>⭐ 15.5K</code> <code>Apache-2.0</code> Time-series foundation model for zero-shot forecasting across</summary>

<br>

*Time-series foundation model for zero-shot forecasting across domains without task-specific training (Google). **Unmaintained - no commits for 12+ months.***

```
  Quality   █████▓░░░░  58/100
  Stars     ⭐ 15,493 (n/a)
  Activity  🔴 Dec 2024 - unmaintained 12+ months
  License   Apache-2.0
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Fine-Tuning

*Tools that automate the process of adapting large language models to specific tasks and domains.*

<details><summary>🟢 <b>78</b> 🥇 <b><a href="https://github.com/unslothai/unsloth">Unsloth</a></b> <code>⭐ 60.1K</code> <code>↗️ +97</code> <code>Apache-2.0</code> Fine-tune LLMs 2-5x faster with 80% less</summary>

<br>

Fine-tune LLMs 2-5x faster with 80% less memory on a single GPU through optimized kernels and custom autograd.

```
  Quality   ███████▓░░  78/100
  Stars     ⭐ 60,067 (+97 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      agent · deepseek · fine-tuning · gemma · gemma3 · gpt-oss · llama · llama3 · llm · llms · mistral · openai · qwen · reinforcement-learning · self-hosted · text-to-speech · tts · ui · unsloth
```

</details>

<details><summary>🟢 <b>69</b> 🥈 <b><a href="https://github.com/hiyouga/LlamaFactory">LLaMA-Factory</a></b> <code>⭐ 69.7K</code> <code>↗️ +29</code> <code>Apache-2.0</code> Unified fine-tuning framework for 100+ LLMs and</summary>

<br>

Unified fine-tuning framework for 100+ LLMs and VLMs with Full, LoRA, QLoRA, and DoRA methods plus web UI (ACL 2024).

```
  Quality   ██████▓░░░  69/100
  Stars     ⭐ 69,721 (+29 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      agent · ai · deepseek · fine-tuning · gemma · gpt · instruction-tuning · large-language-models · llama · llama3 · llm · lora · moe · nlp · peft · qlora · quantization · qwen · rlhf · transformers
```

</details>

<details><summary>🟢 <b>69</b> 🥉 <b><a href="https://github.com/huggingface/trl">TRL</a></b> <code>⭐ 18.0K</code> <code>Apache-2.0</code> Transformer Reinforcement Learning with SFT, DPO, RLHF</summary>

<br>

Transformer Reinforcement Learning with SFT, DPO, RLHF, and GRPO trainers for alignment and preference tuning (Hugging Face).

```
  Quality   ██████▓░░░  69/100
  Stars     ⭐ 17,965 (+4 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
```

</details>

<details><summary>🟢 <b>68</b> <b><a href="https://github.com/axolotl-ai-cloud/axolotl">Axolotl</a></b> <code>⭐ 11.6K</code> <code>Apache-2.0</code> Production-grade fine-tuning with multi-GPU support, sequence parallelism</summary>

<br>

Production-grade fine-tuning with multi-GPU support, sequence parallelism, and multimodal capabilities.

```
  Quality   ██████▓░░░  68/100
  Stars     ⭐ 11,608 (+5 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      fine-tuning · llm
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/huggingface/peft">PEFT</a></b> <code>⭐ 20.9K</code> <code>Apache-2.0</code> Standard library for parameter-efficient fine-tuning - LoRA</summary>

<br>

Standard library for parameter-efficient fine-tuning - LoRA, QLoRA, Spectrum, and more. Deeply integrated with the Hugging Face ecosystem.

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 20,900 (+1 last 30d)
  Activity  🟢 Jan 2026
  License   Apache-2.0
  Tags      adapter · diffusion · fine-tuning · llm · lora · parameter-efficient-learning · peft · python · pytorch · transformers
```

</details>

<details><summary>🟢 <b>65</b> <b><a href="https://github.com/h2oai/h2o-llmstudio">H2O LLM Studio</a></b> <code>⭐ 4.9K</code> <code>Apache-2.0</code> No-code GUI for fine-tuning LLMs with SFT</summary>

<br>

No-code GUI for fine-tuning LLMs with SFT, DPO, and RLHF, plus experiment tracking and one-click Hugging Face Hub export (H2O.ai).

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 4,907 (+1 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      ai · chatbot · chatgpt · fedramp · fine-tuning · finetuning · generative · generative-ai · gpt · llama · llama2 · llm · llm-training
```

</details>

<details><summary>🟢 <b>62</b> <b><a href="https://github.com/Lightning-AI/litgpt">LitGPT</a></b> <code>⭐ 13.3K</code> <code>Apache-2.0</code> Recipes for pretraining, fine-tuning, and deploying 20+</summary>

<br>

Recipes for pretraining, fine-tuning, and deploying 20+ LLM architectures on your own data (Lightning AI).

```
  Quality   ██████░░░░  62/100
  Stars     ⭐ 13,284 (+1 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      ai · artificial-intelligence · deep-learning · large-language-models · llm · llm-inference · llms
```

</details>

<details><summary>🟢 <b>61</b> <b><a href="https://github.com/huggingface/autotrain-advanced">Hugging Face AutoTrain</a></b> <code>⭐ 4.6K</code> <code>Apache-2.0</code> No-code training for LLMs, vision-language models, text</summary>

<br>

No-code training for LLMs, vision-language models, text classification, and tabular data (Hugging Face).

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 4,569 (+1 last 30d)
  Activity  🟢 Jan 2026
  License   Apache-2.0
  Tags      autotrain · deep-learning · huggingface · machine-learning · natural-language-processing · natural-language-understanding · python
```

</details>

<details><summary>🟡 <b>56</b> <b><a href="https://github.com/OptimalScale/LMFlow">LMFlow</a></b> <code>⭐ 8.5K</code> <code>Apache-2.0</code> Extensible toolkit for fine-tuning and inference of</summary>

<br>

Extensible toolkit for fine-tuning and inference of large foundation models, NAACL 2024 Best Demo Award.

```
  Quality   █████▓░░░░  56/100
  Stars     ⭐ 8,489 (+1 last 30d)
  Activity  🟡 Jul 2025
  License   Apache-2.0
  Tags      chatgpt · deep-learning · instruction-following · language-model · pretrained-models · pytorch · transformer
```

</details>

<details><summary>🟡 <b>54</b> <b><a href="https://github.com/mosaicml/llm-foundry">LLM Foundry</a></b> <code>⭐ 4.4K</code> <code>Apache-2.0</code> Composable building blocks for pretraining, fine-tuning, and</summary>

<br>

Composable building blocks for pretraining, fine-tuning, and evaluating foundation models with efficient distributed training (Databricks).

```
  Quality   █████░░░░░  54/100
  Stars     ⭐ 4,397 (+0 last 30d)
  Activity  🟡 Jul 2025
  License   Apache-2.0
  Tags      deep-learning · llm · neural-networks · nlp · pytorch
```

</details>

---

<details><summary>🔴 <b>50</b> 💤 <i><a href="https://github.com/meta-pytorch/torchtune">torchtune</a></i> <code>⭐ 5.7K</code> <code>BSD-3-Clause</code> Native PyTorch library for fine-tuning LLMs with</summary>

<br>

*Native PyTorch library for fine-tuning LLMs with composable building blocks and YAML configs (Meta). **Unmaintained - no commits for 12+ months.***

```
  Quality   █████░░░░░  50/100
  Stars     ⭐ 5,725 (n/a)
  Activity  🔴 Apr 2025 - unmaintained 12+ months
  License   BSD-3-Clause
```

</details>

<details><summary>🔴 <b>49</b> 💤 <i><a href="https://github.com/predibase/lorax">LoRAX</a></i> <code>⭐ 3.7K</code> <code>Apache-2.0</code> Multi-LoRA inference server that scales to thousands</summary>

<br>

*Multi-LoRA inference server that scales to thousands of fine-tuned LLMs on a single GPU (Predibase). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  49/100
  Stars     ⭐ 3,744 (n/a)
  Activity  🔴 Jan 2025 - unmaintained 12+ months
  License   Apache-2.0
  Tags      fine-tuning · gpt · llama · llm · llm-inference · llm-serving · llmops · lora · model-serving · pytorch · transformers
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Prompt Optimization

*Systematic optimization of prompts, instructions, and demonstrations to improve LLM performance without manual tuning.*

<details><summary>🟢 <b>69</b> 🥇 <b><a href="https://github.com/stanfordnlp/dspy">DSPy</a></b> <code>⭐ 33.5K</code> <code>↗️ +13</code> <code>MIT</code> Declarative framework replacing hand-written prompts with automatic</summary>

<br>

Declarative framework replacing hand-written prompts with automatic optimizers - GPT-3.5 with DSPy outperforms expert prompts by up to 46% (Stanford NLP).

```
  Quality   ██████▓░░░  69/100
  Stars     ⭐ 33,526 (+13 last 30d)
  Activity  🟢 Feb 2026
  License   MIT
```

</details>

<details><summary>🟢 <b>64</b> 🥈 <b><a href="https://github.com/gepa-ai/gepa">GEPA</a></b> <code>⭐ 3.2K</code> <code>↗️ +14</code> <code>MIT</code> Reflective text evolution for prompt, code, and</summary>

<br>

Reflective text evolution for prompt, code, and text optimization, integrated into MLflow (Cerebras).

```
  Quality   ██████░░░░  64/100
  Stars     ⭐ 3,228 (+14 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
```

</details>

<details><summary>🟢 <b>57</b> 🥉 <b><a href="https://github.com/Mirascope/mirascope">Mirascope</a></b> <code>⭐ 1.5K</code> <code>MIT</code> Pythonic toolkit for building LLM applications with</summary>

<br>

Pythonic toolkit for building LLM applications with integrated prompt versioning, tracing, and optimization.

```
  Quality   █████▓░░░░  57/100
  Stars     ⭐ 1,454 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      artificial-intelligence · developer-tools · llm · llm-agent · llm-tools · python · typescript
```

</details>

<details><summary>🟡 <b>53</b> <b><a href="https://github.com/microsoft/PromptWizard">PromptWizard</a></b> <code>⭐ 3.8K</code> <code>MIT</code> Task-aware agent-driven prompt optimization using self-evolving critique</summary>

<br>

Task-aware agent-driven prompt optimization using self-evolving critique and synthesis (Microsoft).

```
  Quality   █████░░░░░  53/100
  Stars     ⭐ 3,831 (+1 last 30d)
  Activity  🟡 Aug 2025
  License   MIT
```

</details>

<details><summary>🟢 <b>52</b> <b><a href="https://github.com/meta-llama/prompt-ops">Prompt-Ops</a></b> <code>⭐ 795</code> <code>MIT</code> Open-source command-line tool for building, optimizing, and</summary>

<br>

Open-source command-line tool for building, optimizing, and managing prompts at scale (Meta).

```
  Quality   █████░░░░░  52/100
  Stars     ⭐ 795 (+1 last 30d)
  Activity  🟢 Dec 2025
  License   MIT
```

</details>

<details><summary>🟡 <b>48</b> <b><a href="https://github.com/SalesforceAIResearch/promptomatix">Promptomatix</a></b> <code>⭐ 938</code> <code>Apache-2.0</code> DSPy-powered automatic prompt optimization that transforms task</summary>

<br>

DSPy-powered automatic prompt optimization that transforms task descriptions into optimized prompts with cost-aware objectives (Salesforce).

```
  Quality   ████▓░░░░░  48/100
  Stars     ⭐ 938 (+0 last 30d)
  Activity  🟡 Jul 2025
  License   Apache-2.0
```

</details>

<details><summary>🟡 <b>43</b> <b><a href="https://github.com/beeevita/EvoPrompt">EvoPrompt</a></b> <code>⭐ 224</code> <code>MIT</code> Connects LLMs with evolutionary algorithms for discrete</summary>

<br>

Connects LLMs with evolutionary algorithms for discrete prompt optimization with up to 25% improvement over manual prompts.

```
  Quality   ████░░░░░░  43/100
  Stars     ⭐ 224 (+0 last 30d)
  Activity  🟡 Sep 2025
  License   MIT
```

</details>

---

<details><summary>🔴 <b>48</b> 💤 <i><a href="https://github.com/zou-group/textgrad">TextGrad</a></i> <code>⭐ 3.5K</code> <code>MIT</code> Automatic differentiation via text feedback, enabling gradient-like</summary>

<br>

*Automatic differentiation via text feedback, enabling gradient-like optimization of compound AI systems (Nature 2024). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  48/100
  Stars     ⭐ 3,474 (n/a)
  Activity  🔴 Dec 2024 - unmaintained 12+ months
  License   MIT
  Tags      ai-optimization · compound-systems · large-language-models · prompt-optimization · textual-gradients
```

</details>

<details><summary>🔴 <b>48</b> 💤 <i><a href="https://github.com/Eladlev/AutoPrompt">AutoPrompt</a></i> <code>⭐ 3.0K</code> <code>Apache-2.0</code> Intent-based prompt calibration using synthetic data generation</summary>

<br>

*Intent-based prompt calibration using synthetic data generation for iterative prompt refinement. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  48/100
  Stars     ⭐ 2,960 (n/a)
  Activity  🔴 Mar 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      prompt-engineering · prompt-tuning · synthetic-dataset-generation
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated AI Research

*Autonomous systems that design experiments, run them, and analyze results without human intervention.*

<details><summary>🟢 <b>78</b> 🥇 <b><a href="https://github.com/karpathy/autoresearch">AutoResearch</a></b> <code>⭐ 68.4K</code> <code>↗️ +280</code> Minimal script enabling AI agents to autonomously</summary>

<br>

Minimal script enabling AI agents to autonomously run ~100 ML experiments overnight at ~12/hour, finding genuine improvements that transfer to larger models (Karpathy, March 2026).

```
  Quality   ███████▓░░  78/100
  Stars     ⭐ 68,363 (+280 last 30d)
  Activity  🟢 Mar 2026
  License   -
```

</details>

<details><summary>🟢 <b>74</b> 🥈 <b><a href="https://github.com/crewAIInc/crewAI">CrewAI</a></b> <code>⭐ 48.3K</code> <code>↗️ +36</code> <code>MIT</code> Multi-agent framework orchestrating role-playing specialist agents for</summary>

<br>

Multi-agent framework orchestrating role-playing specialist agents for complex AI workflows.

```
  Quality   ███████░░░  74/100
  Stars     ⭐ 48,309 (+36 last 30d)
  Activity  🟢 Apr 2026
  License   MIT
  Tags      agents · ai · ai-agents · aiagentframework · llms
```

</details>

<details><summary>🟢 <b>66</b> 🥉 <b><a href="https://github.com/Future-House/paper-qa">PaperQA</a></b> <code>⭐ 8.3K</code> <code>Apache-2.0</code> High-accuracy retrieval-augmented generation for answering questions from</summary>

<br>

High-accuracy retrieval-augmented generation for answering questions from scientific literature.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 8,348 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      ai · rag · science · search
```

</details>

<details><summary>🟡 <b>63</b> <b><a href="https://github.com/microsoft/autogen">AutoGen</a></b> <code>⭐ 56.8K</code> <code>↗️ +14</code> <code>CC-BY-4.0</code> Multi-agent conversation framework for building AI agent</summary>

<br>

Multi-agent conversation framework for building AI agent systems. Now in maintenance mode as AG2 (Microsoft).

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 56,808 (+14 last 30d)
  Activity  🟡 Sep 2025
  License   CC-BY-4.0
  Tags      agentic · agentic-agi · agents · ai · autogen · autogen-ecosystem · chatgpt · framework · llm-agent · llm-framework
```

</details>

<details><summary>🟢 <b>63</b> <b><a href="https://github.com/SakanaAI/AI-Scientist">AI-Scientist</a></b> <code>⭐ 13.1K</code> <code>↗️ +16</code> <code>NOASSERTION</code> Fully automated open-ended scientific discovery from idea</summary>

<br>

Fully automated open-ended scientific discovery from idea generation to experiment execution to paper writing (Sakana AI).

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 13,115 (+16 last 30d)
  Activity  🟢 Dec 2025
  License   NOASSERTION
```

</details>

<details><summary>🟢 <b>61</b> <b><a href="https://github.com/SakanaAI/AI-Scientist-v2">AI-Scientist-v2</a></b> <code>⭐ 5.3K</code> <code>↗️ +43</code> <code>NOASSERTION</code> Second generation using agentic tree search, producing</summary>

<br>

Second generation using agentic tree search, producing the first AI-generated paper accepted at a peer-reviewed workshop.

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 5,250 (+43 last 30d)
  Activity  🟢 Dec 2025
  License   NOASSERTION
```

</details>

<details><summary>🟢 <b>54</b> <b><a href="https://github.com/WecoAI/aideml">AIDE</a></b> <code>⭐ 1.2K</code> <code>MIT</code> ML engineering agent using tree search over</summary>

<br>

ML engineering agent using tree search over solution space - exceeds 50% of human Kaggle competitors; top agents using AIDE achieve medals in 64%+ of MLE-Bench competitions (Weco AI).

```
  Quality   █████░░░░░  54/100
  Stars     ⭐ 1,212 (+0 last 30d)
  Activity  🟢 Nov 2025
  License   MIT
  Tags      ai · ai-agents · automated-machine-learning · autonomous-agents · autoresearch · code-optimization · data-science · llm · machine-learning · self-improving-ai
```

</details>

<details><summary>🟢 <b>49</b> <b><a href="https://github.com/HKUDS/AI-Researcher">AI-Researcher</a></b> <code>⭐ 5.1K</code> Autonomous agent automating the full research lifecycle</summary>

<br>

Autonomous agent automating the full research lifecycle from literature review to experimentation (NeurIPS 2025 Spotlight).

```
  Quality   ████▓░░░░░  49/100
  Stars     ⭐ 5,072 (+5 last 30d)
  Activity  🟢 Oct 2025
  License   -
  Tags      ai-researcher
```

</details>

<details><summary>🟡 <b>31</b> <b><a href="https://github.com/DeepAuto-AI/automl-agent">AutoML-Agent</a></b> <code>⭐ 118</code> Multi-agent LLM framework for full-pipeline AutoML from</summary>

<br>

Multi-agent LLM framework for full-pipeline AutoML from data retrieval through model deployment (ICML 2025).

```
  Quality   ███░░░░░░░  31/100
  Stars     ⭐ 118 (+0 last 30d)
  Activity  🟡 Jul 2025
  License   -
  Tags      automl · llm-agents · multi-agent-systems
```

</details>

---

<details><summary>🔴 <b>56</b> 💤 <i><a href="https://github.com/stanford-oval/storm">STORM</a></i> <code>⭐ 28.1K</code> <code>MIT</code> LLM-powered knowledge curation that researches topics and</summary>

<br>

*LLM-powered knowledge curation that researches topics and generates full articles with citations (Stanford). **Unmaintained - no commits for 12+ months.***

```
  Quality   █████▓░░░░  56/100
  Stars     ⭐ 28,060 (n/a)
  Activity  🔴 Jan 2025 - unmaintained 12+ months
  License   MIT
  Tags      agentic-rag · deep-research · emnlp2024 · knowledge-curation · large-language-models · naacl · nlp · report-generation · retrieval-augmented-generation
```

</details>


**[⬆ Back to Contents](#contents)**

## ML Engineering Agents

*AI agents that autonomously write, debug, and optimize code for software and ML engineering.*

<details><summary>🟢 <b>75</b> 🥇 <b><a href="https://github.com/OpenHands/OpenHands">OpenHands</a></b> <code>⭐ 70.8K</code> <code>↗️ +28</code> <code>NOASSERTION</code> AI software development platform achieving 53-72% resolve</summary>

<br>

AI software development platform achieving 53-72% resolve rate on SWE-Bench Verified.

```
  Quality   ███████▓░░  75/100
  Stars     ⭐ 70,796 (+28 last 30d)
  Activity  🟢 Mar 2026
  License   NOASSERTION
  Tags      agent · artificial-intelligence · chatgpt · claude-ai · cli · developer-tools · gpt · llm · openai
```

</details>

<details><summary>🟢 <b>64</b> 🥈 <b><a href="https://github.com/SWE-agent/mini-swe-agent">mini-swe-agent</a></b> <code>⭐ 3.7K</code> <code>MIT</code> Minimalist 100-line coding agent achieving 74% on</summary>

<br>

Minimalist 100-line coding agent achieving 74% on SWE-bench Verified as a learning reference.

```
  Quality   ██████░░░░  64/100
  Stars     ⭐ 3,710 (+7 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      agent · agentic-ai · agentic-ai-cli · ai · ai-agent · textual
```

</details>

<details><summary>🟢 <b>64</b> 🥉 <b><a href="https://github.com/Marker-Inc-Korea/AutoRAG">AutoRAG</a></b> <code>⭐ 4.7K</code> <code>Apache-2.0</code> AutoML-style framework for RAG optimization that automatically</summary>

<br>

AutoML-style framework for RAG optimization that automatically finds the best retrieval, generation, and prompt pipeline configuration.

```
  Quality   ██████░░░░  64/100
  Stars     ⭐ 4,687 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      analysis · automl · benchmarking · document-parser · embeddings · evaluation · llm · llm-evaluation · llm-ops · open-source · ops · optimization · pipeline · python · qa · rag · rag-evaluation · retrieval-augmented-generation
```

</details>

<details><summary>🟡 <b>62</b> <b><a href="https://github.com/Aider-AI/aider">Aider</a></b> <code>⭐ 43.0K</code> <code>↗️ +16</code> <code>Apache-2.0</code> AI pair programmer in the terminal that</summary>

<br>

AI pair programmer in the terminal that edits code directly in your local repository.

```
  Quality   ██████░░░░  62/100
  Stars     ⭐ 42,981 (+16 last 30d)
  Activity  🟡 Aug 2025
  License   Apache-2.0
  Tags      anthropic · chatgpt · claude-3 · cli · command-line · gemini · gpt-3 · gpt-35-turbo · gpt-4 · gpt-4o · llama · openai · sonnet
```

</details>

<details><summary>🟡 <b>59</b> <b><a href="https://github.com/SWE-agent/SWE-agent">SWE-agent</a></b> <code>⭐ 18.9K</code> <code>MIT</code> Autonomous agent that solves real GitHub issues</summary>

<br>

Autonomous agent that solves real GitHub issues by reading, editing, and testing code (NeurIPS 2024).

```
  Quality   █████▓░░░░  59/100
  Stars     ⭐ 18,947 (+3 last 30d)
  Activity  🟡 May 2025
  License   MIT
  Tags      agent · agent-based-model · ai · cybersecurity · developer-tools · llm · lms
```

</details>

---

<details><summary>🔴 <b>48</b> 💤 <i><a href="https://github.com/AutoCodeRoverSG/auto-code-rover">AutoCodeRover</a></i> <code>⭐ 3.1K</code> <code>NOASSERTION</code> Structure-aware autonomous program repair combining code search</summary>

<br>

*Structure-aware autonomous program repair combining code search with LLM-based patching. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  48/100
  Stars     ⭐ 3,064 (n/a)
  Activity  🔴 Sep 2024 - unmaintained 12+ months
  License   NOASSERTION
```

</details>


**[⬆ Back to Contents](#contents)**

## LLM Evaluation and Testing

*Frameworks for automated evaluation, testing, and benchmarking of language models and AI systems.*

<details><summary>🟢 <b>71</b> 🥇 <b><a href="https://github.com/promptfoo/promptfoo">Promptfoo</a></b> <code>⭐ 19.7K</code> <code>↗️ +24</code> <code>MIT</code> Test and red-team LLM applications with automated</summary>

<br>

Test and red-team LLM applications with automated evaluations, CI/CD integration, and vulnerability scanning.

```
  Quality   ███████░░░  71/100
  Stars     ⭐ 19,733 (+24 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      ci · ci-cd · cicd · evaluation · evaluation-framework · llm · llm-eval · llm-evaluation · llm-evaluation-framework · llmops · pentesting · prompt-engineering · prompt-testing · prompts · rag · red-teaming · testing · vulnerability-scanners
```

</details>

<details><summary>🟢 <b>65</b> 🥈 <b><a href="https://github.com/vibrantlabsai/ragas">RAGAS</a></b> <code>⭐ 13.3K</code> <code>Apache-2.0</code> Evaluation framework for RAG quality assessment measuring</summary>

<br>

Evaluation framework for RAG quality assessment measuring both retrieval and generation with LLM-based and traditional metrics.

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 13,275 (+8 last 30d)
  Activity  🟢 Jan 2026
  License   Apache-2.0
  Tags      evaluation · llm · llmops
```

</details>

<details><summary>🟢 <b>65</b> 🥉 <b><a href="https://github.com/EleutherAI/lm-evaluation-harness">lm-evaluation-harness</a></b> <code>⭐ 12.0K</code> <code>MIT</code> Standard framework for few-shot evaluation of language</summary>

<br>

Standard framework for few-shot evaluation of language models across hundreds of benchmarks (EleutherAI).

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 12,046 (+6 last 30d)
  Activity  🟢 Feb 2026
  License   MIT
  Tags      evaluation-framework · language-model · transformer
```

</details>

<details><summary>🟢 <b>64</b> <b><a href="https://github.com/Agenta-AI/agenta">Agenta</a></b> <code>⭐ 4.0K</code> <code>NOASSERTION</code> Open-source LLMOps platform combining prompt playground, evaluation</summary>

<br>

Open-source LLMOps platform combining prompt playground, evaluation workflows, and production observability.

```
  Quality   ██████░░░░  64/100
  Stars     ⭐ 4,013 (+1 last 30d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      agents · evaluation · llm-as-a-judge · llm-evaluation · llm-framework · llm-monitoring · llm-observability · llm-platform · llm-playground · llm-tools · llmops · observability · prompt-engineering · prompt-management · rag-evaluation
```

</details>

<details><summary>🟢 <b>63</b> <b><a href="https://github.com/confident-ai/deepeval">DeepEval</a></b> <code>⭐ 14.6K</code> <code>↗️ +17</code> <code>Apache-2.0</code> Pytest-like framework with 14+ evaluation metrics for</summary>

<br>

Pytest-like framework with 14+ evaluation metrics for RAG, fine-tuning, and alignment assessment.

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 14,593 (+17 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      evaluation-framework · evaluation-metrics · llm-evaluation · llm-evaluation-framework · llm-evaluation-metrics · python
```

</details>

<details><summary>🟢 <b>63</b> <b><a href="https://github.com/open-compass/opencompass">OpenCompass</a></b> <code>⭐ 6.8K</code> <code>Apache-2.0</code> One-stop evaluation platform supporting 100+ models across</summary>

<br>

One-stop evaluation platform supporting 100+ models across academic and real-world benchmarks.

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 6,837 (+2 last 30d)
  Activity  🟢 Feb 2026
  License   Apache-2.0
  Tags      benchmark · chatgpt · evaluation · large-language-model · llama2 · llama3 · llm · openai
```

</details>

<details><summary>🟢 <b>63</b> <b><a href="https://github.com/truera/trulens">TruLens</a></b> <code>⭐ 3.2K</code> <code>MIT</code> OpenTelemetry-based tracing and evaluation for RAG and</summary>

<br>

OpenTelemetry-based tracing and evaluation for RAG and agent workflows with built-in feedback functions (Snowflake/TruEra).

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 3,233 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      agent-evaluation · agentops · ai-agents · ai-monitoring · ai-observability · evals · explainable-ml · llm-eval · llm-evaluation · llmops · llms · machine-learning · neural-networks
```

</details>

<details><summary>🟢 <b>63</b> <b><a href="https://github.com/langwatch/langwatch">LangWatch</a></b> <code>⭐ 3.2K</code> <code>NOASSERTION</code> Evaluation and testing platform for LLM applications</summary>

<br>

Evaluation and testing platform for LLM applications and AI agents with automated quality guardrails.

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 3,187 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      ai · analytics · datasets · dspy · evaluation · gpt · llm · llm-ops · llmops · low-code · observability · openai · prompt-engineering
```

</details>

<details><summary>🟢 <b>61</b> <b><a href="https://github.com/UKGovernmentBEIS/inspect_ai">Inspect AI</a></b> <code>⭐ 1.9K</code> <code>MIT</code> Framework for reproducible LLM evals with sandboxed</summary>

<br>

Framework for reproducible LLM evals with sandboxed agent execution, 100+ prebuilt evaluations, and VS Code integration (UK AI Safety Institute).

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 1,889 (+2 last 30d)
  Activity  🟢 Apr 2026
  License   MIT
```

</details>

<details><summary>🟢 <b>56</b> <b><a href="https://github.com/huggingface/lighteval">LightEval</a></b> <code>⭐ 2.4K</code> <code>MIT</code> All-in-one LLM evaluation toolkit powering the Open</summary>

<br>

All-in-one LLM evaluation toolkit powering the Open LLM Leaderboard, supporting 1000+ tasks across multiple backends (Hugging Face).

```
  Quality   █████▓░░░░  56/100
  Stars     ⭐ 2,369 (+0 last 30d)
  Activity  🟢 Nov 2025
  License   MIT
  Tags      evaluation · evaluation-framework · evaluation-metrics · huggingface
```

</details>


**[⬆ Back to Contents](#contents)**

## LLM Routing and Selection

*Intelligent routing of requests to the optimal model based on task complexity, cost, and performance.*

<details><summary>🟢 <b>74</b> 🥇 <b><a href="https://github.com/BerriAI/litellm">LiteLLM</a></b> <code>⭐ 42.5K</code> <code>↗️ +47</code> <code>NOASSERTION</code> Unified API gateway for 100+ LLMs with</summary>

<br>

Unified API gateway for 100+ LLMs with load balancing, cost tracking, and automatic fallback routing.

```
  Quality   ███████░░░  74/100
  Stars     ⭐ 42,517 (+47 last 30d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      ai-gateway · anthropic · azure-openai · bedrock · gateway · langchain · litellm · llm · llm-gateway · llmops · mcp-gateway · openai · openai-proxy · vertex-ai
```

</details>

<details><summary>🟢 <b>67</b> 🥈 <b><a href="https://github.com/tensorzero/tensorzero">TensorZero</a></b> <code>⭐ 11.2K</code> <code>Apache-2.0</code> Open-source LLMOps platform unifying an LLM gateway</summary>

<br>

Open-source LLMOps platform unifying an LLM gateway, observability, evaluation, optimization, and experimentation with A/B testing across models.

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 11,190 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      ai · ai-engineering · anthropic · artificial-intelligence · deep-learning · genai · generative-ai · gpt · large-language-models · llama · llm · llmops · llms · machine-learning · ml · ml-engineering · mlops · openai · python · rust
```

</details>

<details><summary>🟢 <b>65</b> 🥉 <b><a href="https://github.com/Portkey-AI/gateway">Portkey Gateway</a></b> <code>⭐ 11.2K</code> <code>MIT</code> AI gateway for intelligent routing, caching, load</summary>

<br>

AI gateway for intelligent routing, caching, load balancing, and fallbacks across 200+ LLMs.

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 11,236 (+2 last 30d)
  Activity  🟢 Jan 2026
  License   MIT
  Tags      ai-gateway · gateway · generative-ai · hacktoberfest · langchain · llm · llm-gateway · llmops · llms · mcp · mcp-client · mcp-gateway · mcp-servers · model-router · openai
```

</details>

<details><summary>🟢 <b>61</b> <b><a href="https://github.com/ulab-uiuc/LLMRouter">LLMRouter</a></b> <code>⭐ 1.6K</code> <code>MIT</code> Unified library with 16+ router implementations and</summary>

<br>

Unified library with 16+ router implementations and standardized evaluation via command-line interface.

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 1,609 (+2 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
```

</details>

---

<details><summary>🔴 <b>49</b> 💤 <i><a href="https://github.com/lm-sys/RouteLLM">RouteLLM</a></i> <code>⭐ 4.8K</code> <code>Apache-2.0</code> Framework for training and serving LLM routers</summary>

<br>

*Framework for training and serving LLM routers that reduce costs by up to 85% without quality loss (LMSYS). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  49/100
  Stars     ⭐ 4,768 (n/a)
  Activity  🔴 Aug 2024 - unmaintained 12+ months
  License   Apache-2.0
```

</details>


**[⬆ Back to Contents](#contents)**

## Time-Series AutoML

*Automated forecasting, classification, and anomaly detection for temporal data.*

<details><summary>🟢 <b>67</b> 🥇 <b><a href="https://github.com/unit8co/darts">Darts</a></b> <code>⭐ 9.3K</code> <code>Apache-2.0</code> Unified API for 30+ forecasting models from</summary>

<br>

Unified API for 30+ forecasting models from ARIMA to transformers, with backtesting and ensembling built in.

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 9,311 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      anomaly-detection · data-science · deep-learning · forecasting · machine-learning · python · time-series
```

</details>

<details><summary>🟢 <b>64</b> 🥈 <b><a href="https://github.com/Nixtla/neuralforecast">Nixtla NeuralForecast</a></b> <code>⭐ 4.0K</code> <code>Apache-2.0</code> Production-ready neural forecasting with 30+ state-of-the-art models</summary>

<br>

Production-ready neural forecasting with 30+ state-of-the-art models including N-BEATS, TFT, and PatchTST.

```
  Quality   ██████░░░░  64/100
  Stars     ⭐ 4,034 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      baselines · baselines-zoo · deep-learning · deep-neural-networks · deepar · esrnn · forecasting · hierarchical-forecasting · hint · machine-learning · nbeats · nbeatsx · neural-network · nhits · probabilistic-forecasting · pytorch · robust-regression · tft · time-series · transformer
```

</details>

<details><summary>🟢 <b>61</b> 🥉 <b><a href="https://github.com/sktime/sktime">sktime</a></b> <code>⭐ 9.7K</code> <code>BSD-3-Clause</code> Unified framework for time-series forecasting, classification, regression</summary>

<br>

Unified framework for time-series forecasting, classification, regression, and clustering with scikit-learn-compatible interfaces.

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 9,714 (+2 last 30d)
  Activity  🟢 Nov 2025
  License   BSD-3-Clause
  Tags      ai · anomaly-detection · changepoint-detection · data-mining · data-science · forecasting · hacktoberfest · machine-learning · scikit-learn · sktime · time-series · time-series-analysis · time-series-classification · time-series-regression · time-series-segmentation
```

</details>

<details><summary>🟢 <b>61</b> <b><a href="https://github.com/WenjieDu/PyPOTS">PyPOTS</a></b> <code>⭐ 2.0K</code> <code>BSD-3-Clause</code> Toolbox with 50+ deep learning models for</summary>

<br>

Toolbox with 50+ deep learning models for partially-observed time-series imputation, classification, and clustering.

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 1,984 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   BSD-3-Clause
  Tags      anomaly-detection · classification · clustering · data-analysis · data-mining · data-science · deep-learning · forecasting · generation · imputation · machine-learning · missing-values · neural-networks · pytorch · time-series
```

</details>

<details><summary>🟢 <b>60</b> <b><a href="https://github.com/skforecast/skforecast">skforecast</a></b> <code>⭐ 1.5K</code> <code>BSD-3-Clause</code> Scikit-learn-compatible multi-step forecasting with XGBoost, LightGBM, CatBoost</summary>

<br>

Scikit-learn-compatible multi-step forecasting with XGBoost, LightGBM, CatBoost, and feature engineering utilities.

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 1,473 (-3 last 30d)
  Activity  🟢 Mar 2026
  License   BSD-3-Clause
  Tags      arima · autoregressive-forecasting · backtesting-forecasters · data-science · direct-forecasting · exogenous-predictors · forecasting · lightgbm · lstm-neural-networks · machine-learning · multi-series-forecasting · multi-step-forecasting · multiple-time-series-forecasting · probabilistic-forecasting · python · quantile-forecasting · sarimax · scikit-learn · time-series · xgboost
```

</details>

<details><summary>🟢 <b>60</b> <b><a href="https://github.com/winedarksea/AutoTS">AutoTS</a></b> <code>⭐ 1.4K</code> <code>MIT</code> Genetic algorithm-based automated model selection, ensembling, and</summary>

<br>

Genetic algorithm-based automated model selection, ensembling, and anomaly detection for time-series data.

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 1,385 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      automl · autots · deep-learning · feature-engineering · forecasting · machine-learning · preprocessing · time-series
```

</details>

<details><summary>🟢 <b>60</b> <b><a href="https://github.com/aeon-toolkit/aeon">aeon</a></b> <code>⭐ 1.4K</code> <code>BSD-3-Clause</code> Next-generation time-series ML toolkit for classification, regression</summary>

<br>

Next-generation time-series ML toolkit for classification, regression, clustering, and anomaly detection.

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 1,367 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   BSD-3-Clause
  Tags      aeon · ai · artificial-intelligence · data-mining · data-science · deep-learning · forecasting · machine-learning · neural-network · scikit-learn · time-series · time-series-analysis · time-series-anomaly-detection · time-series-classification · time-series-clustering · time-series-regression · time-series-segmentation
```

</details>

<details><summary>🟢 <b>60</b> <b><a href="https://github.com/Nixtla/mlforecast">Nixtla MLForecast</a></b> <code>⭐ 1.2K</code> <code>Apache-2.0</code> Scalable ML-based forecasting with LightGBM, XGBoost, and</summary>

<br>

Scalable ML-based forecasting with LightGBM, XGBoost, and distributed backends via Dask, Spark, and Ray.

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 1,204 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      dask · forecast · forecasting · lightgbm · machine-learning · python · time-series · xgboost
```

</details>

<details><summary>🟢 <b>59</b> <b><a href="https://github.com/Time-MoE/Time-MoE">Time-MoE</a></b> <code>⭐ 943</code> <code>Apache-2.0</code> First billion-scale time-series foundation model using sparse</summary>

<br>

First billion-scale time-series foundation model using sparse mixture-of-experts, trained on 300B+ time points (ICLR 2025 Spotlight).

```
  Quality   █████▓░░░░  59/100
  Stars     ⭐ 943 (+2 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      deep-learning · large-model · machine-learning · time-series · time-series-forecasting · time-series-foundation-model
```

</details>

<details><summary>🟢 <b>58</b> <b><a href="https://github.com/Nixtla/statsforecast">Nixtla StatsForecast</a></b> <code>⭐ 4.7K</code> <code>Apache-2.0</code> Lightning-fast statistical models including AutoARIMA, AutoETS, and</summary>

<br>

Lightning-fast statistical models including AutoARIMA, AutoETS, and AutoCES for millions of time series.

```
  Quality   █████▓░░░░  58/100
  Stars     ⭐ 4,746 (+0 last 30d)
  Activity  🟢 Oct 2025
  License   Apache-2.0
  Tags      arima · automl · baselines · data-science · econometrics · ets · exponential-smoothing · fbprophet · forecasting · machine-learning · mstl · naive · neuralprophet · predictions · prophet · python · seasonal-naive · statistics · theta · time-series
```

</details>

<details><summary>🟢 <b>55</b> <b><a href="https://github.com/ibm-granite/granite-tsfm">Granite-TSFM</a></b> <code>⭐ 834</code> <code>Apache-2.0</code> Compact pretrained Tiny Time Mixers that rival</summary>

<br>

Compact pretrained Tiny Time Mixers that rival billion-parameter models for zero/few-shot multivariate forecasting (IBM, NeurIPS 2024).

```
  Quality   █████▓░░░░  55/100
  Stars     ⭐ 834 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
```

</details>

<details><summary>🟡 <b>50</b> <b><a href="https://github.com/time-series-foundation-models/lag-llama">Lag-Llama</a></b> <code>⭐ 1.6K</code> <code>Apache-2.0</code> First open-source foundation model for univariate probabilistic</summary>

<br>

First open-source foundation model for univariate probabilistic time-series forecasting based on a decoder-only transformer (NeurIPS 2024).

```
  Quality   █████░░░░░  50/100
  Stars     ⭐ 1,568 (+0 last 30d)
  Activity  🟡 Jun 2025
  License   Apache-2.0
  Tags      forecasting · foundation-models · lag-llama · llama · time-series · time-series-forecasting · time-series-prediction · time-series-transformer · timeseries · timeseries-forecasting · transformers
```

</details>

---

<details><summary>🔴 <b>39</b> 💤 <i><a href="https://github.com/salesforce/Merlion">Merlion</a></i> <code>⭐ 4.5K</code> <code>BSD-3-Clause</code> Time-series intelligence library with unified interfaces for</summary>

<br>

*Time-series intelligence library with unified interfaces for forecasting, anomaly detection, and change-point detection (Salesforce). **Archived.***

```
  Quality   ███▓░░░░░░  39/100
  Stars     ⭐ 4,471 (n/a)
  Activity  🔴 Feb 2023 - archived
  License   BSD-3-Clause
  Tags      anomaly-detection · automl · benchmarking · ensemble-learning · forecasting · machine-learning · time-series
```

</details>


**[⬆ Back to Contents](#contents)**

## Neural Architecture Search

*Automated design and discovery of optimal neural network architectures.*

---

<details><summary>🔴 <b>50</b> 💤 <i><a href="https://github.com/google/automl">Google AutoML</a></i> <code>⭐ 6.5K</code> <code>Apache-2.0</code> Research code for EfficientNet, EfficientDet, MnasNet, and</summary>

<br>

*Research code for EfficientNet, EfficientDet, MnasNet, and other NAS-discovered architectures (Google Brain). **Unmaintained - no commits for 12+ months.***

```
  Quality   █████░░░░░  50/100
  Stars     ⭐ 6,463 (n/a)
  Activity  🔴 Mar 2021 - unmaintained 12+ months
  License   Apache-2.0
  Tags      automl · efficientdet · efficientnet · efficientnetv2 · object-detection
```

</details>

<details><summary>🔴 <b>46</b> 💤 <i><a href="https://github.com/mit-han-lab/once-for-all">Once-For-All</a></i> <code>⭐ 1.9K</code> <code>MIT</code> Train one network and specialize sub-networks for</summary>

<br>

*Train one network and specialize sub-networks for diverse hardware without retraining (MIT HAN Lab, ICLR 2020). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  46/100
  Stars     ⭐ 1,947 (n/a)
  Activity  🔴 Jun 2020 - unmaintained 12+ months
  License   MIT
  Tags      acceleration · automl · edge-ai · efficient-model · nas · tinyml
```

</details>

<details><summary>🔴 <b>44</b> 💤 <i><a href="https://github.com/mit-han-lab/tinyengine">TinyEngine</a></i> <code>⭐ 934</code> <code>MIT</code> Memory-efficient inference engine for NAS-optimized models on</summary>

<br>

*Memory-efficient inference engine for NAS-optimized models on microcontrollers (MIT HAN Lab). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  44/100
  Stars     ⭐ 934 (n/a)
  Activity  🔴 Nov 2024 - unmaintained 12+ months
  License   MIT
  Tags      c · codegenerator · cpp · deep-learning · edge-computing · microcontroller · neural-architecture-search · pytorch · quantization · tinyml
```

</details>

<details><summary>🔴 <b>43</b> 💤 <i><a href="https://github.com/microsoft/nni">NNI</a></i> <code>⭐ 14.3K</code> <code>MIT</code> Comprehensive AutoML toolkit for NAS, hyperparameter tuning</summary>

<br>

*Comprehensive AutoML toolkit for NAS, hyperparameter tuning, feature engineering, and model compression. **Archived by Microsoft in Sep 2024.***

```
  Quality   ████░░░░░░  43/100
  Stars     ⭐ 14,347 (n/a)
  Activity  🔴 Sep 2023 - archived
  License   MIT
  Tags      automated-machine-learning · automl · bayesian-optimization · data-science · deep-learning · deep-neural-network · distributed · feature-engineering · hyperparameter-optimization · hyperparameter-tuning · machine-learning · machine-learning-algorithms · mlops · model-compression · nas · neural-architecture-search · neural-network · python · pytorch · tensorflow
```

</details>

<details><summary>🔴 <b>43</b> 💤 <i><a href="https://github.com/huawei-noah/vega">Vega</a></i> <code>⭐ 851</code> <code>NOASSERTION</code> AutoML pipeline covering NAS, hyperparameter optimization, auto-augmentation</summary>

<br>

*AutoML pipeline covering NAS, hyperparameter optimization, auto-augmentation, and model compression (Huawei). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  43/100
  Stars     ⭐ 851 (n/a)
  Activity  🔴 Sep 2022 - unmaintained 12+ months
  License   NOASSERTION
```

</details>

<details><summary>🔴 <b>42</b> 💤 <i><a href="https://github.com/automl/NASLib">NASLib</a></i> <code>⭐ 586</code> <code>Apache-2.0</code> NAS research library from AutoML Freiburg with</summary>

<br>

*NAS research library from AutoML Freiburg with interfaces to state-of-the-art search spaces and optimizers. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  42/100
  Stars     ⭐ 586 (n/a)
  Activity  🔴 Jul 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      automl · nas · neural-architecture-search
```

</details>

<details><summary>🔴 <b>41</b> 💤 <i><a href="https://github.com/microsoft/archai">Archai</a></i> <code>⭐ 483</code> <code>MIT</code> Modular NAS framework for reproducible architecture search</summary>

<br>

*Modular NAS framework for reproducible architecture search research (Microsoft). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  41/100
  Stars     ⭐ 483 (n/a)
  Activity  🔴 Sep 2023 - unmaintained 12+ months
  License   MIT
  Tags      automated-machine-learning · automl · darts · deep-learning · hyperparameter-optimization · machine-learning · model-compression · nas · neural-architecture-search · petridish · python · pytorch
```

</details>


**[⬆ Back to Contents](#contents)**

## Hyperparameter Optimization

*Automated tuning of model hyperparameters using Bayesian, evolutionary, and other search strategies.*

<details><summary>🟢 <b>73</b> 🥇 <b><a href="https://docs.ray.io/en/latest/tune/">Ray Tune</a></b> <code>⭐ 42.0K</code> <code>↗️ +12</code> <code>Apache-2.0</code> Distributed hyperparameter tuning at scale with support</summary>

<br>

Distributed hyperparameter tuning at scale with support for any ML framework and many search algorithms.

```
  Quality   ███████░░░  73/100
  Stars     ⭐ 42,015 (+12 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      data-science · deep-learning · deployment · distributed · hyperparameter-optimization · hyperparameter-search · large-language-models · llm · llm-inference · llm-serving · machine-learning · optimization · parallel · python · pytorch · ray · reinforcement-learning · rllib · serving · tensorflow
```

</details>

<details><summary>🟢 <b>68</b> 🥈 <b><a href="https://github.com/optuna/optuna">Optuna</a></b> <code>⭐ 13.9K</code> <code>MIT</code> Define-by-run API with pruning, distributed execution, and</summary>

<br>

Define-by-run API with pruning, distributed execution, and a dashboard - the most widely adopted HPO framework.

```
  Quality   ██████▓░░░  68/100
  Stars     ⭐ 13,871 (+5 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      distributed · hyperparameter-optimization · machine-learning · parallel · python
```

</details>

<details><summary>🟢 <b>60</b> 🥉 <b><a href="https://github.com/meta-pytorch/botorch">BoTorch</a></b> <code>⭐ 3.5K</code> <code>MIT</code> Bayesian optimization library in PyTorch for high-dimensional</summary>

<br>

Bayesian optimization library in PyTorch for high-dimensional, noisy, and multi-objective problems (Meta).

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 3,498 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
```

</details>

<details><summary>🟢 <b>59</b> <b><a href="https://github.com/facebook/Ax">Ax</a></b> <code>⭐ 2.7K</code> <code>MIT</code> Adaptive experimentation platform for multi-objective optimization with</summary>

<br>

Adaptive experimentation platform for multi-objective optimization with BoTorch integration (Meta).

```
  Quality   █████▓░░░░  59/100
  Stars     ⭐ 2,733 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
```

</details>

<details><summary>🟢 <b>57</b> <b><a href="https://github.com/keras-team/keras-tuner">Keras Tuner</a></b> <code>⭐ 2.9K</code> <code>Apache-2.0</code> Hyperparameter search for Keras models with built-in</summary>

<br>

Hyperparameter search for Keras models with built-in Bayesian optimization and Hyperband.

```
  Quality   █████▓░░░░  57/100
  Stars     ⭐ 2,923 (+0 last 30d)
  Activity  🟢 Nov 2025
  License   Apache-2.0
  Tags      automl · deep-learning · hyperparameter-optimization · keras · machine-learning · tensorflow
```

</details>

---

<details><summary>🟢 <b>63</b> 💤 <i><a href="https://github.com/hyperopt/hyperopt">Hyperopt</a></i> <code>⭐ 7.6K</code> <code>NOASSERTION</code> Pioneered tree-structured Parzen estimators for HPO</summary>

<br>

*Pioneered tree-structured Parzen estimators for HPO. **Deprecated since Nov 2021 - use Optuna instead.***

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 7,616 (n/a)
  Activity  🟢 Feb 2026 - unmaintained 12+ months
  License   NOASSERTION
  Tags      hacktoberfest
```

</details>

<details><summary>🔴 <b>46</b> 💤 <i><a href="https://github.com/google/vizier">Google Vizier</a></i> <code>⭐ 1.6K</code> <code>Apache-2.0</code> Research interface for blackbox and hyperparameter optimization</summary>

<br>

*Research interface for blackbox and hyperparameter optimization with Bayesian, evolutionary, and multi-objective algorithms based on Google's internal Vizier Service. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  46/100
  Stars     ⭐ 1,635 (n/a)
  Activity  🔴 Feb 2025 - unmaintained 12+ months
  License   Apache-2.0
  Tags      algorithm · bayesian-optimization · blackbox-optimization · deep-learning · distributed-computing · distributed-systems · evolutionary-algorithms · google · grpc · hyperparameter-optimization · hyperparameter-tuning · machine-learning · open-source · optimization · tuning · tuning-parameters · vizier
```

</details>

<details><summary>🔴 <b>45</b> 💤 <i><a href="https://github.com/automl/SMAC3">SMAC3</a></i> <code>⭐ 1.2K</code> <code>NOASSERTION</code> Sequential model-based algorithm configuration combining Bayesian optimization</summary>

<br>

*Sequential model-based algorithm configuration combining Bayesian optimization with racing mechanisms (AutoML Freiburg). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  45/100
  Stars     ⭐ 1,218 (n/a)
  Activity  🔴 Jan 2025 - unmaintained 12+ months
  License   NOASSERTION
  Tags      algorithm-configuration · automated-machine-learning · automl · bayesian-optimisation · bayesian-optimization · configuration · gaussian-process · hyperparameter-optimization · hyperparameter-search · hyperparameter-tuning · random-forest
```

</details>

<details><summary>🔴 <b>44</b> 💤 <i><a href="https://github.com/dragonfly/dragonfly">Dragonfly</a></i> <code>⭐ 893</code> <code>MIT</code> Scalable Bayesian optimization library supporting multi-fidelity and</summary>

<br>

*Scalable Bayesian optimization library supporting multi-fidelity and multi-objective search. **Low activity since 2020.***

```
  Quality   ████░░░░░░  44/100
  Stars     ⭐ 893 (n/a)
  Activity  🔴 Oct 2022 - unmaintained 12+ months
  License   MIT
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Feature Engineering

*Automated generation, transformation, and selection of features from raw data.*

<details><summary>🟢 <b>64</b> 🥇 <b><a href="https://github.com/cleanlab/cleanlab">Cleanlab</a></b> <code>⭐ 11.4K</code> <code>Apache-2.0</code> Data-centric AI toolkit for finding and fixing</summary>

<br>

Data-centric AI toolkit for finding and fixing label errors, outliers, and data quality issues automatically.

```
  Quality   ██████░░░░  64/100
  Stars     ⭐ 11,411 (+0 last 30d)
  Activity  🟢 Jan 2026
  License   Apache-2.0
  Tags      active-learning · annotation · anomaly-detection · data-annotation · data-centric-ai · data-cleaning · data-curation · data-labeling · data-profiling · data-quality · data-science · data-validation · datasets · exploratory-data-analysis · labeling · machine-learning · noisy-labels · out-of-distribution-detection · outlier-detection · weak-supervision
```

</details>

<details><summary>🟡 <b>56</b> 🥈 <b><a href="https://github.com/blue-yonder/tsfresh">tsfresh</a></b> <code>⭐ 9.2K</code> <code>MIT</code> Automatic extraction of hundreds of time-series features</summary>

<br>

Automatic extraction of hundreds of time-series features with built-in statistical relevance filtering.

```
  Quality   █████▓░░░░  56/100
  Stars     ⭐ 9,169 (+1 last 30d)
  Activity  🟡 Aug 2025
  License   MIT
  Tags      data-science · feature-extraction · time-series
```

</details>

<details><summary>🟢 <b>51</b> 🥉 <b><a href="https://github.com/cod3licious/autofeat">AutoFeat</a></b> <code>⭐ 536</code> <code>MIT</code> Scikit-learn-compatible automated feature engineering and selection that</summary>

<br>

Scikit-learn-compatible automated feature engineering and selection that generates non-linear features and selects robust subsets.

```
  Quality   █████░░░░░  51/100
  Stars     ⭐ 536 (+0 last 30d)
  Activity  🟢 Jan 2026
  License   MIT
  Tags      automated-data-science · automated-feature-engineering · automated-machine-learning · automl · feature-engineering · feature-selection · linear-regression · machine-learning · machine-learning-models
```

</details>

---

<details><summary>🔴 <b>51</b> 💤 <i><a href="https://github.com/alteryx/featuretools">Featuretools</a></i> <code>⭐ 7.6K</code> <code>BSD-3-Clause</code> Deep feature synthesis for automatically creating meaningful</summary>

<br>

*Deep feature synthesis for automatically creating meaningful features from relational and temporal data (Alteryx). **Unmaintained - no commits for 12+ months.***

```
  Quality   █████░░░░░  51/100
  Stars     ⭐ 7,628 (n/a)
  Activity  🔴 May 2024 - unmaintained 12+ months
  License   BSD-3-Clause
  Tags      automated-feature-engineering · automated-machine-learning · automl · data-science · feature-engineering · machine-learning · python · scikit-learn
```

</details>

<details><summary>🔴 <b>47</b> 💤 <i><a href="https://github.com/feature-engine/feature_engine">Feature-engine</a></i> <code>⭐ 2.2K</code> <code>BSD-3-Clause</code> Scikit-learn-compatible transformers for feature creation, selection, encoding</summary>

<br>

*Scikit-learn-compatible transformers for feature creation, selection, encoding, and imputation. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  47/100
  Stars     ⭐ 2,221 (n/a)
  Activity  🔴 Jan 2022 - unmaintained 12+ months
  License   BSD-3-Clause
  Tags      data-science · feature-engineering · feature-extraction · feature-selection · machine-learning · python · scikit-learn
```

</details>

<details><summary>🔴 <b>46</b> 💤 <i><a href="https://github.com/4paradigm/OpenMLDB">OpenMLDB</a></i> <code>⭐ 1.7K</code> <code>Apache-2.0</code> Database for consistent feature computation between training</summary>

<br>

*Database for consistent feature computation between training and serving with SQL-based feature engineering (SIGMOD 2025). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  46/100
  Stars     ⭐ 1,685 (n/a)
  Activity  🔴 Feb 2025 - unmaintained 12+ months
  License   Apache-2.0
  Tags      database-for-ai · database-for-machine-learning · feature-engineering · feature-extraction · feature-store · featureops · featurestore · in-memory-database · machine-learning · machine-learning-database · mlops
```

</details>

<details><summary>🔴 <b>46</b> 💤 <i><a href="https://github.com/scikit-learn-contrib/boruta_py">Boruta</a></i> <code>⭐ 1.6K</code> <code>BSD-3-Clause</code> All-relevant feature selection wrapper using random forest</summary>

<br>

*All-relevant feature selection wrapper using random forest shadow features to identify important predictors. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  46/100
  Stars     ⭐ 1,624 (n/a)
  Activity  🔴 Aug 2024 - unmaintained 12+ months
  License   BSD-3-Clause
```

</details>

<details><summary>🔴 <b>44</b> 💤 <i><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a></i> <code>⭐ 1.1K</code> <code>Apache-2.0</code> GPU-accelerated feature engineering and preprocessing for terabyte-scale</summary>

<br>

*GPU-accelerated feature engineering and preprocessing for terabyte-scale tabular data with automatic hashing, categorification, and normalization (NVIDIA). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  44/100
  Stars     ⭐ 1,140 (n/a)
  Activity  🔴 Aug 2023 - unmaintained 12+ months
  License   Apache-2.0
  Tags      deep-learning · feature-engineering · feature-selection · gpu · machine-learning · nvidia · preprocessing · recommendation-system · recommender-system
```

</details>

<details><summary>🔴 <b>38</b> 💤 <i><a href="https://github.com/noahho/CAAFE">CAAFE</a></i> <code>⭐ 186</code> <code>NOASSERTION</code> LLM-powered context-aware feature engineering that generates semantically</summary>

<br>

*LLM-powered context-aware feature engineering that generates semantically meaningful features with explanations. **Unmaintained - no commits for 12+ months.***

```
  Quality   ███▓░░░░░░  38/100
  Stars     ⭐ 186 (n/a)
  Activity  🔴 Dec 2024 - unmaintained 12+ months
  License   NOASSERTION
  Tags      automl · data-science · deep-learning · feature-engineering · machine-learning · tabpfn
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Data Preprocessing

*Automated data profiling, cleaning, validation, and quality assurance.*

<details><summary>🟢 <b>68</b> 🥇 <b><a href="https://github.com/great-expectations/great_expectations">Great Expectations</a></b> <code>⭐ 11.4K</code> <code>Apache-2.0</code> Programmable data validation and documentation framework for</summary>

<br>

Programmable data validation and documentation framework for maintaining pipeline quality.

```
  Quality   ██████▓░░░  68/100
  Stars     ⭐ 11,368 (+2 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      cleandata · data-engineering · data-profilers · data-profiling · data-quality · data-science · data-unit-tests · datacleaner · datacleaning · dataquality · dataunittest · eda · exploratory-analysis · exploratory-data-analysis · exploratorydataanalysis · mlops · pipeline · pipeline-debt · pipeline-testing · pipeline-tests
```

</details>

<details><summary>🟢 <b>65</b> 🥈 <b><a href="https://github.com/Data-Centric-AI-Community/ydata-profiling">ydata-profiling</a></b> <code>⭐ 13.5K</code> <code>MIT</code> One-line data quality profiling and exploratory analysis</summary>

<br>

One-line data quality profiling and exploratory analysis for Pandas and Spark DataFrames.

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 13,489 (+0 last 30d)
  Activity  🟢 Jan 2026
  License   MIT
  Tags      big-data-analytics · data-analysis · data-exploration · data-profiling · data-quality · data-science · deep-learning · eda · exploration · exploratory-data-analysis · hacktoberfest · html-report · jupyter · jupyter-notebook · machine-learning · pandas · pandas-dataframe · pandas-profiling · python · statistics
```

</details>

<details><summary>🟢 <b>64</b> 🥉 <b><a href="https://github.com/unionai-oss/pandera">Pandera</a></b> <code>⭐ 4.3K</code> <code>MIT</code> Statistical data testing and validation for dataframes</summary>

<br>

Statistical data testing and validation for dataframes with expressive schema definitions.

```
  Quality   ██████░░░░  64/100
  Stars     ⭐ 4,290 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      assertions · data-assertions · data-check · data-cleaning · data-processing · data-validation · data-verification · dataframe-schema · dataframes · hypothesis-testing · pandas · pandas-dataframe · pandas-validation · pandas-validator · schema · testing · testing-tools · validation
```

</details>

<details><summary>🟢 <b>63</b> <b><a href="https://github.com/fbdesignpro/sweetviz">SweetViz</a></b> <code>⭐ 3.1K</code> <code>MIT</code> High-density EDA visualizations and target analysis reports</summary>

<br>

High-density EDA visualizations and target analysis reports generated in two lines of code.

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 3,089 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   MIT
  Tags      data-analysis · data-exploration · data-profiling · data-science · data-visualization · eda · exploration · exploratory-data-analysis · machine-learning · pandas · pandas-dataframe · python · statistics
```

</details>

<details><summary>🟢 <b>60</b> <b><a href="https://github.com/Renumics/spotlight">Spotlight</a></b> <code>⭐ 1.3K</code> <code>MIT</code> Interactive visualization tool for auditing and understanding</summary>

<br>

Interactive visualization tool for auditing and understanding unstructured ML datasets covering images, audio, and text.

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 1,255 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      audio · computer-vision · data-centric-ai · data-curation · data-visualization · exploratory-data-analysis · hacktoberfest · images · machine-learning · meshes · timeseries · unstructured-data · video
```

</details>

<details><summary>🟢 <b>60</b> <b><a href="https://github.com/pyjanitor-devs/pyjanitor">pyjanitor</a></b> <code>⭐ 1.5K</code> <code>MIT</code> Clean APIs for data cleaning with a</summary>

<br>

Clean APIs for data cleaning with a fluent method-chaining interface for pandas DataFrames, inspired by the R Janitor package.

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 1,486 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   MIT
  Tags      cleaning-data · data · data-engineering · dataframe · hacktoberfest · pandas · pydata
```

</details>

---

<details><summary>🔴 <b>47</b> 💤 <i><a href="https://github.com/sfu-db/dataprep">DataPrep</a></i> <code>⭐ 2.2K</code> <code>MIT</code> Low-code library for data collection, cleaning, and</summary>

<br>

*Low-code library for data collection, cleaning, and EDA that is 10x faster than traditional profiling. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  47/100
  Stars     ⭐ 2,237 (n/a)
  Activity  🔴 Jul 2022 - unmaintained 12+ months
  License   MIT
  Tags      apis · apiwrapper · cleaning · connector · data-exploration · data-science · datacleaning · dataconnector · dataprep · datapreparation · eda · exploratory-data-analysis · webconnector
```

</details>

<details><summary>🔴 <b>45</b> 💤 <i><a href="https://github.com/hi-primus/optimus">Optimus</a></i> <code>⭐ 1.5K</code> <code>Apache-2.0</code> Agile data preparation supporting Pandas, Dask, cuDF</summary>

<br>

*Agile data preparation supporting Pandas, Dask, cuDF, and PySpark with a unified API. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  45/100
  Stars     ⭐ 1,537 (n/a)
  Activity  🔴 Jul 2020 - unmaintained 12+ months
  License   Apache-2.0
  Tags      big-data-cleaning · bigdata · cudf · dask · dask-cudf · data-analysis · data-cleaner · data-cleaning · data-cleansing · data-exploration · data-extraction · data-preparation · data-profiling · data-science · data-transformation · data-wrangling · machine-learning · pyspark · spark
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Data Labeling

*Tools that automate or semi-automate the annotation process using AI-assisted labeling.*

<details><summary>🟢 <b>71</b> 🥇 <b><a href="https://github.com/HumanSignal/label-studio">Label Studio</a></b> <code>⭐ 27.0K</code> <code>Apache-2.0</code> Multi-type data labeling platform with ML-assisted annotation</summary>

<br>

Multi-type data labeling platform with ML-assisted annotation and LLM integration for text, images, audio, and video.

```
  Quality   ███████░░░  71/100
  Stars     ⭐ 26,955 (+9 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      annotation · annotation-tool · annotations · boundingbox · computer-vision · data-labeling · dataset · datasets · deep-learning · image-annotation · image-classification · image-labeling · image-labelling-tool · label-studio · labeling · labeling-tool · mlops · semantic-segmentation · text-annotation · yolo
```

</details>

<details><summary>🟢 <b>67</b> 🥈 <b><a href="https://github.com/CVHub520/X-AnyLabeling">X-AnyLabeling</a></b> <code>⭐ 8.7K</code> <code>GPL-3.0</code> AI-assisted annotation with Segment Anything and other</summary>

<br>

AI-assisted annotation with Segment Anything and other foundation models for automatic segmentation, detection, and classification pre-labeling.

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 8,664 (+4 last 30d)
  Activity  🟢 Mar 2026
  License   GPL-3.0
  Tags      artificial-intelligence · clip · computer-vision · deep-learning · groundingdino · image-annotation-tool · image-classification · image-labeling-tool · image-matting · instance-segmentation · machine-learning · object-detection · ocr · onnxruntime · paddlepaddle · pose-estimation · rotated-object-detection · sam · vision-language-model · yolo
```

</details>

<details><summary>🟡 <b>50</b> 🥉 <b><a href="https://github.com/opendatalab/labelU">LabelU</a></b> <code>⭐ 1.5K</code> <code>Apache-2.0</code> Multi-modal annotation toolbox supporting image, audio, and</summary>

<br>

Multi-modal annotation toolbox supporting image, audio, and video with configurable templates and collaborative labeling workflows.

```
  Quality   █████░░░░░  50/100
  Stars     ⭐ 1,538 (+0 last 30d)
  Activity  🟡 Oct 2025
  License   Apache-2.0
```

</details>

---

<details><summary>🔴 <b>50</b> 💤 <i><a href="https://github.com/snorkel-team/snorkel">Snorkel</a></i> <code>⭐ 5.9K</code> <code>Apache-2.0</code> Programmatic labeling via weak supervision - write</summary>

<br>

*Programmatic labeling via weak supervision - write labeling functions instead of hand-labeling. **Unmaintained - no commits for 12+ months.***

```
  Quality   █████░░░░░  50/100
  Stars     ⭐ 5,947 (n/a)
  Activity  🔴 Feb 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      ai · data-augmentation · data-science · data-slicing · labeling · machine-learning · python · snorkel · training-data · weak-supervision
```

</details>

<details><summary>🔴 <b>50</b> 💤 <i><a href="https://github.com/argilla-io/argilla">Argilla</a></i> <code>⭐ 4.9K</code> <code>Apache-2.0</code> Collaboration platform for collecting and managing human</summary>

<br>

*Collaboration platform for collecting and managing human and AI feedback for NLP and LLM development. **Unmaintained - no commits for 12+ months.***

```
  Quality   █████░░░░░  50/100
  Stars     ⭐ 4,928 (n/a)
  Activity  🔴 Mar 2025 - unmaintained 12+ months
  License   Apache-2.0
  Tags      active-learning · ai · annotation-tool · developer-tools · gpt-4 · human-in-the-loop · langchain · llm · machine-learning · mlops · natural-language-processing · nlp · rlhf · text-annotation · text-labeling · weak-supervision · weakly-supervised-learning
```

</details>

<details><summary>🔴 <b>48</b> 💤 <i><a href="https://github.com/argilla-io/distilabel">Distilabel</a></i> <code>⭐ 3.2K</code> <code>Apache-2.0</code> Framework for synthetic data generation, AI feedback</summary>

<br>

*Framework for synthetic data generation, AI feedback, and instruction tuning using Self-Instruct and EvolInstruct techniques. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  48/100
  Stars     ⭐ 3,157 (n/a)
  Activity  🔴 Jan 2025 - unmaintained 12+ months
  License   Apache-2.0
  Tags      ai · huggingface · llms · openai · python · rlaif · rlhf · synthetic-data · synthetic-dataset-generation
```

</details>

<details><summary>🔴 <b>47</b> 💤 <i><a href="https://github.com/autodistill/autodistill">Autodistill</a></i> <code>⭐ 2.7K</code> <code>Apache-2.0</code> Automated image labeling by distilling foundation model</summary>

<br>

*Automated image labeling by distilling foundation model knowledge into smaller task-specific models (Roboflow). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  47/100
  Stars     ⭐ 2,658 (n/a)
  Activity  🔴 Feb 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      auto-labeling · computer-vision · deep-learning · foundation-models · grounding-dino · image-annotation · image-classification · instance-segmentation · labeling-tool · machine-learning · model-distillation · multimodal · object-detection · pytorch · segment-anything · yolov5 · yolov8
```

</details>

<details><summary>🔴 <b>47</b> 💤 <i><a href="https://github.com/refuel-ai/autolabel">Autolabel</a></i> <code>⭐ 2.3K</code> <code>MIT</code> LLM-powered labeling, cleaning, and enrichment for text</summary>

<br>

*LLM-powered labeling, cleaning, and enrichment for text classification, NER, and entity matching. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  47/100
  Stars     ⭐ 2,310 (n/a)
  Activity  🔴 Oct 2023 - unmaintained 12+ months
  License   MIT
  Tags      anthropic-claude · data-science · gpt-4 · huggingface-transformers · langchain · large-language-models · llm · llms · machine-learning · openai · python
```

</details>

<details><summary>🔴 <b>45</b> 💤 <i><a href="https://github.com/HumanSignal/Adala">Adala</a></i> <code>⭐ 1.4K</code> <code>Apache-2.0</code> Autonomous data labeling agent that uses LLMs</summary>

<br>

*Autonomous data labeling agent that uses LLMs to label data, learn from ground truth, and iteratively improve labeling quality (Label Studio team). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  45/100
  Stars     ⭐ 1,419 (n/a)
  Activity  🔴 Nov 2023 - unmaintained 12+ months
  License   Apache-2.0
  Tags      agent · agent-based-framework · agent-oriented-programming · autonomous-agents · gpt-4
```

</details>


**[⬆ Back to Contents](#contents)**

## Synthetic Data Generation

*Automated creation of artificial training data that preserves statistical properties of real datasets.*

<details><summary>🟢 <b>63</b> 🥇 <b><a href="https://github.com/sdv-dev/SDV">SDV</a></b> <code>⭐ 3.5K</code> <code>NOASSERTION</code> Synthetic Data Vault with multiple generative models</summary>

<br>

Synthetic Data Vault with multiple generative models (GaussianCopula, CTGAN, TVAE) for single-table, multi-table, and sequential data.

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 3,463 (+2 last 30d)
  Activity  🟢 Mar 2026
  License   NOASSERTION
  Tags      data-generation · deep-learning · gan · gans · generative-adversarial-network · generative-ai · generative-model · generativeai · machine-learning · multi-table · relational-datasets · sdv · synthetic-data · synthetic-data-generation · time-series
```

</details>

<details><summary>🟢 <b>62</b> 🥈 <b><a href="https://github.com/NVIDIA-NeMo/DataDesigner">NeMo Data Designer</a></b> <code>⭐ 1.5K</code> <code>↗️ +27</code> <code>Apache-2.0</code> Generates high-quality synthetic data from scratch or</summary>

<br>

Generates high-quality synthetic data from scratch or seed data with built-in evaluation and quality control for LLM training pipelines (NVIDIA).

```
  Quality   ██████░░░░  62/100
  Stars     ⭐ 1,522 (+27 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      agentic-ai · data-augmentation · data-generation · llm · mcp · multimodal · nemo · nvidia · sdg · synthetic-data · tool-use
```

</details>

<details><summary>🟢 <b>61</b> 🥉 <b><a href="https://github.com/bespokelabsai/curator">Curator</a></b> <code>⭐ 1.7K</code> <code>Apache-2.0</code> Pipeline-oriented synthetic data curation for post-training and</summary>

<br>

Pipeline-oriented synthetic data curation for post-training and structured data extraction with built-in quality filtering from LLMs.

```
  Quality   ██████░░░░  61/100
  Stars     ⭐ 1,660 (+2 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      agents · deep-learning · fine-tuning · instruction-tuning · llm · machine-learning · natural-language-processing · prompt · python · synthetic-data · synthetic-dataset-generation
```

</details>

<details><summary>🟢 <b>55</b> <b><a href="https://github.com/meta-llama/synthetic-data-kit">Synthetic Data Kit</a></b> <code>⭐ 1.6K</code> <code>MIT</code> Toolkit for generating high-quality synthetic datasets to</summary>

<br>

Toolkit for generating high-quality synthetic datasets to fine-tune models with LLM-generated training data at scale (Meta).

```
  Quality   █████▓░░░░  55/100
  Stars     ⭐ 1,560 (+0 last 30d)
  Activity  🟢 Oct 2025
  License   MIT
  Tags      data · generation · llm · python · synthetic
```

</details>

---

<details><summary>🔴 <b>47</b> 💤 <i><a href="https://github.com/hitsz-ids/synthetic-data-generator">SDG</a></i> <code>⭐ 2.4K</code> <code>Apache-2.0</code> Framework for generating high-quality synthetic tabular data</summary>

<br>

*Framework for generating high-quality synthetic tabular data preserving statistical distributions and correlations. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  47/100
  Stars     ⭐ 2,416 (n/a)
  Activity  🔴 Dec 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      agent · data-generator · deep-learning · gan · generative-ai · llm · machine-learning · privacy · synthetic-data · tabular-data
```

</details>

<details><summary>🔴 <b>44</b> 💤 <i><a href="https://github.com/datadreamer-dev/DataDreamer">DataDreamer</a></i> <code>⭐ 1.1K</code> <code>MIT</code> Reproducible LLM workflows for prompting, synthetic data</summary>

<br>

*Reproducible LLM workflows for prompting, synthetic data generation, and model training in one pipeline. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  44/100
  Stars     ⭐ 1,108 (n/a)
  Activity  🔴 Feb 2025 - unmaintained 12+ months
  License   MIT
  Tags      alignment · deep-learning · fine-tuning · gpt · instruction-tuning · llm · llmops · llms · machine-learning · natural-language-processing · nlp · nlp-library · openai · python · pytorch · synthetic-data · synthetic-dataset-generation · transformers
```

</details>

<details><summary>🔴 <b>37</b> 💤 <i><a href="https://github.com/gretelai/gretel-synthetics">Gretel Synthetics</a></i> <code>⭐ 676</code> <code>NOASSERTION</code> Synthetic data generators for structured and unstructured</summary>

<br>

*Synthetic data generators for structured and unstructured text with differential privacy guarantees. **Archived.***

```
  Quality   ███▓░░░░░░  37/100
  Stars     ⭐ 676 (n/a)
  Activity  🔴 Jun 2025 - archived
  License   NOASSERTION
  Tags      artificial-intelligence · differential-privacy · privacy · synthetic-data · tensorflow
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Model Compression

*Automated quantization, pruning, and distillation for efficient model deployment.*

<details><summary>🟢 <b>63</b> 🥇 <b><a href="https://github.com/vllm-project/llm-compressor">LLM Compressor</a></b> <code>⭐ 3.0K</code> <code>Apache-2.0</code> Transformers-compatible compression library optimized for efficient vLLM</summary>

<br>

Transformers-compatible compression library optimized for efficient vLLM inference.

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 2,986 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      compression · quantization
```

</details>

<details><summary>🟢 <b>63</b> 🥈 <b><a href="https://github.com/bitsandbytes-foundation/bitsandbytes">bitsandbytes</a></b> <code>⭐ 8.1K</code> <code>MIT</code> De facto standard for k-bit quantization of</summary>

<br>

De facto standard for k-bit quantization of LLMs in PyTorch - enables 4-bit and 8-bit inference and training, the backbone for QLoRA.

```
  Quality   ██████░░░░  63/100
  Stars     ⭐ 8,102 (+2 last 30d)
  Activity  🟢 Feb 2026
  License   MIT
  Tags      llm · machine-learning · pytorch · qlora · quantization
```

</details>

<details><summary>🟢 <b>62</b> 🥉 <b><a href="https://github.com/NVIDIA/Model-Optimizer">NVIDIA TensorRT Model Optimizer</a></b> <code>⭐ 2.4K</code> <code>Apache-2.0</code> Quantization, pruning, distillation, and speculative decoding optimized</summary>

<br>

Quantization, pruning, distillation, and speculative decoding optimized for TensorRT and vLLM deployment.

```
  Quality   ██████░░░░  62/100
  Stars     ⭐ 2,399 (+3 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
```

</details>

<details><summary>🟢 <b>59</b> <b><a href="https://github.com/ModelCloud/GPTQModel">GPTQModel</a></b> <code>⭐ 1.1K</code> <code>NOASSERTION</code> LLM quantization toolkit with support for NVIDIA</summary>

<br>

LLM quantization toolkit with support for NVIDIA CUDA, AMD ROCm, Intel, and Apple Silicon backends.

```
  Quality   █████▓░░░░  59/100
  Stars     ⭐ 1,093 (+1 last 30d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      gptq · optimum · peft · quantization · sglang · transformers · vllm
```

</details>

<details><summary>🟢 <b>59</b> <b><a href="https://github.com/microsoft/Olive">Olive</a></b> <code>⭐ 2.3K</code> <code>MIT</code> End-to-end model optimization automating fine-tuning, conversion, quantization</summary>

<br>

End-to-end model optimization automating fine-tuning, conversion, quantization, and graph optimization for CPUs, GPUs, and NPUs (Microsoft).

```
  Quality   █████▓░░░░  59/100
  Stars     ⭐ 2,288 (+0 last 30d)
  Activity  🟢 Jan 2026
  License   MIT
```

</details>

<details><summary>🟢 <b>57</b> <b><a href="https://github.com/huggingface/optimum">Optimum</a></b> <code>⭐ 3.4K</code> <code>Apache-2.0</code> Toolkit for accelerating Transformers inference with hardware-optimized</summary>

<br>

Toolkit for accelerating Transformers inference with hardware-optimized quantization, pruning, and graph optimization for ONNX Runtime, OpenVINO, and more (Hugging Face).

```
  Quality   █████▓░░░░  57/100
  Stars     ⭐ 3,350 (+0 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      graphcore · habana · inference · intel · onnx · onnxruntime · optimization · pytorch · quantization · tflite · training · transformers
```

</details>

<details><summary>🟢 <b>56</b> <b><a href="https://github.com/intel/neural-compressor">Intel Neural Compressor</a></b> <code>⭐ 2.6K</code> <code>Apache-2.0</code> Unified quantization, sparsity, pruning, and distillation across</summary>

<br>

Unified quantization, sparsity, pruning, and distillation across PyTorch, TensorFlow, and ONNX (Intel).

```
  Quality   █████▓░░░░  56/100
  Stars     ⭐ 2,612 (+1 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      auto-tuning · awq · fp4 · gptq · int4 · int8 · knowledge-distillation · large-language-models · low-precision · mxformat · post-training-quantization · pruning · quantization · quantization-aware-training · smoothquant · sparsegpt · sparsity
```

</details>

<details><summary>🟡 <b>53</b> <b><a href="https://github.com/mit-han-lab/llm-awq">LLM-AWQ</a></b> <code>⭐ 3.5K</code> <code>MIT</code> Activation-aware weight quantization achieving lossless 4-bit compression</summary>

<br>

Activation-aware weight quantization achieving lossless 4-bit compression for LLMs (MIT HAN Lab, MLSys 2024 Best Paper).

```
  Quality   █████░░░░░  53/100
  Stars     ⭐ 3,493 (+2 last 30d)
  Activity  🟡 Jul 2025
  License   MIT
```

</details>

<details><summary>🟡 <b>53</b> <b><a href="https://github.com/VainF/Torch-Pruning">Torch-Pruning</a></b> <code>⭐ 3.3K</code> <code>MIT</code> Structural pruning framework for any PyTorch model</summary>

<br>

Structural pruning framework for any PyTorch model including LLMs, YOLO, ViT, and diffusion models (CVPR 2023).

```
  Quality   █████░░░░░  53/100
  Stars     ⭐ 3,283 (+1 last 30d)
  Activity  🟡 Sep 2025
  License   MIT
  Tags      efficient-deep-learning · llm · model-compression · pruning · transformers · vision
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Deployment and Serving

*Automated model serving, optimization, and inference infrastructure.*

<details><summary>🟢 <b>79</b> 🥇 <b><a href="https://github.com/ggml-org/llama.cpp">llama.cpp</a></b> <code>⭐ 102.4K</code> <code>↗️ +73</code> <code>MIT</code> LLM inference in C/C++ with broad hardware</summary>

<br>

LLM inference in C/C++ with broad hardware support - the foundation for most local LLM applications.

```
  Quality   ███████▓░░  79/100
  Stars     ⭐ 102,415 (+73 last 30d)
  Activity  🟢 Apr 2026
  License   MIT
  Tags      ggml
```

</details>

<details><summary>🟢 <b>78</b> 🥈 <b><a href="https://github.com/ollama/ollama">Ollama</a></b> <code>⭐ 168.1K</code> <code>↗️ +58</code> <code>MIT</code> Docker-like local LLM runner for getting models</summary>

<br>

Docker-like local LLM runner for getting models up and running quickly for prototyping.

```
  Quality   ███████▓░░  78/100
  Stars     ⭐ 168,090 (+58 last 30d)
  Activity  🟢 Apr 2026
  License   MIT
  Tags      deepseek · gemma · gemma3 · glm · go · golang · gpt-oss · llama · llama3 · llm · llms · minimax · mistral · ollama · qwen
```

</details>

<details><summary>🟢 <b>77</b> 🥉 <b><a href="https://github.com/vllm-project/vllm">vLLM</a></b> <code>⭐ 75.7K</code> <code>↗️ +56</code> <code>Apache-2.0</code> High-throughput LLM serving engine with PagedAttention, powering</summary>

<br>

High-throughput LLM serving engine with PagedAttention, powering most open-source LLM deployments in production.

```
  Quality   ███████▓░░  77/100
  Stars     ⭐ 75,656 (+56 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      amd · blackwell · cuda · deepseek · deepseek-v3 · gpt · gpt-oss · inference · kimi · llama · llm · llm-serving · model-serving · moe · openai · pytorch · qwen · qwen3 · tpu · transformer
```

</details>

<details><summary>🟢 <b>71</b> <b><a href="https://github.com/sgl-project/sglang">SGLang</a></b> <code>⭐ 25.5K</code> <code>↗️ +20</code> <code>Apache-2.0</code> High-performance LLM serving framework powering 400K+ GPUs</summary>

<br>

High-performance LLM serving framework powering 400K+ GPUs with best-in-class structured and constrained decoding.

```
  Quality   ███████░░░  71/100
  Stars     ⭐ 25,546 (+20 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      attention · blackwell · cuda · deepseek · diffusion · glm · gpt-oss · inference · llama · llm · minimax · moe · qwen · qwen-image · reinforcement-learning · transformer · vlm · wan
```

</details>

<details><summary>🟢 <b>70</b> <b><a href="https://github.com/microsoft/onnxruntime">ONNX Runtime</a></b> <code>⭐ 19.8K</code> <code>↗️ +10</code> <code>MIT</code> Cross-platform inference accelerator supporting PyTorch, TensorFlow, scikit-learn</summary>

<br>

Cross-platform inference accelerator supporting PyTorch, TensorFlow, scikit-learn, and XGBoost via the ONNX format (Microsoft).

```
  Quality   ███████░░░  70/100
  Stars     ⭐ 19,795 (+10 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      ai-framework · deep-learning · hardware-acceleration · machine-learning · neural-networks · onnx · pytorch · scikit-learn · tensorflow
```

</details>

<details><summary>🟢 <b>68</b> <b><a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a></b> <code>⭐ 13.3K</code> <code>NOASSERTION</code> High-performance LLM inference library with custom attention</summary>

<br>

High-performance LLM inference library with custom attention kernels, speculative decoding, and MoE support (NVIDIA).

```
  Quality   ██████▓░░░  68/100
  Stars     ⭐ 13,319 (+4 last 30d)
  Activity  🟢 Mar 2026
  License   NOASSERTION
  Tags      blackwell · cuda · llm-serving · moe · pytorch
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a></b> <code>⭐ 10.5K</code> <code>BSD-3-Clause</code> Multi-framework inference serving for TensorRT, PyTorch, ONNX</summary>

<br>

Multi-framework inference serving for TensorRT, PyTorch, ONNX, and custom backends (NVIDIA).

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 10,527 (+2 last 30d)
  Activity  🟢 Mar 2026
  License   BSD-3-Clause
  Tags      cloud · datacenter · deep-learning · edge · gpu · inference · machine-learning
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/openvinotoolkit/openvino">OpenVINO</a></b> <code>⭐ 10.0K</code> <code>Apache-2.0</code> Inference optimization and deployment toolkit for CPUs</summary>

<br>

Inference optimization and deployment toolkit for CPUs, GPUs, and edge accelerators (Intel).

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 10,029 (+5 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      ai · computer-vision · deep-learning · deploy-ai · diffusion-models · generative-ai · good-first-issue · inference · llm-inference · natural-language-processing · nlp · openvino · optimize-ai · performance-boost · recommendation-system · speech-recognition · stable-diffusion · transformers · yolo
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/bentoml/BentoML">BentoML</a></b> <code>⭐ 8.6K</code> <code>Apache-2.0</code> Build production-ready inference APIs, batch jobs, and</summary>

<br>

Build production-ready inference APIs, batch jobs, and multi-model pipelines with unified Python framework.

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 8,563 (+1 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      ai-inference · deep-learning · generative-ai · inference-platform · llm · llm-inference · llm-serving · llmops · machine-learning · ml-engineering · mlops · model-inference-service · model-serving · multimodal · python
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/replicate/cog">Cog</a></b> <code>⭐ 9.4K</code> <code>Apache-2.0</code> Package ML models as standard Docker containers</summary>

<br>

Package ML models as standard Docker containers with auto-generated HTTP APIs and GPU setup for reproducible, portable deployment (Replicate).

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 9,373 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      ai · containers · cuda · docker · machine-learning · pytorch · tensorflow
```

</details>

<details><summary>🟢 <b>66</b> <b><a href="https://github.com/InternLM/lmdeploy">LMDeploy</a></b> <code>⭐ 7.8K</code> <code>Apache-2.0</code> Toolkit for compressing, deploying, and serving large</summary>

<br>

Toolkit for compressing, deploying, and serving large language and vision-language models.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 7,759 (+2 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      codellama · cuda-kernels · deepspeed · fastertransformer · internlm · llama · llama2 · llama3 · llm · llm-inference · turbomind
```

</details>

<details><summary>🟢 <b>65</b> <b><a href="https://github.com/kserve/kserve">KServe</a></b> <code>⭐ 5.3K</code> <code>Apache-2.0</code> Kubernetes-native standardized model serving with canary rollouts</summary>

<br>

Kubernetes-native standardized model serving with canary rollouts, autoscaling, and multi-framework support (CNCF Incubating).

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 5,305 (+5 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      artificial-intelligence · cncf · genai · hacktoberfest · istio · k8s · knative · kserve · kubeflow · kubernetes · llm-inference · machine-learning · mlops · model-interpretability · model-serving · pytorch · service-mesh · tensorflow · vllm · xgboost
```

</details>

<details><summary>🟢 <b>64</b> <b><a href="https://github.com/pytorch/executorch">ExecuTorch</a></b> <code>⭐ 4.5K</code> <code>NOASSERTION</code> On-device AI inference for mobile, embedded, and</summary>

<br>

On-device AI inference for mobile, embedded, and edge platforms with a 50KB base runtime footprint (Meta).

```
  Quality   ██████░░░░  64/100
  Stars     ⭐ 4,481 (+1 last 30d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      deep-learning · embedded · gpu · machine-learning · mobile · neural-network · tensor
```

</details>

<details><summary>🟢 <b>59</b> <b><a href="https://github.com/tensorflow/tfx">TFX</a></b> <code>⭐ 2.2K</code> <code>Apache-2.0</code> End-to-end platform for deploying production ML pipelines</summary>

<br>

End-to-end platform for deploying production ML pipelines with data validation, transformation, training, evaluation, and serving components (Google).

```
  Quality   █████▓░░░░  59/100
  Stars     ⭐ 2,178 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      apache-beam · machine-learning · tensorflow
```

</details>

<details><summary>🟢 <b>58</b> <b><a href="https://github.com/Lightning-AI/LitServe">LitServe</a></b> <code>⭐ 3.9K</code> <code>Apache-2.0</code> Minimal, high-performance Python framework for AI model</summary>

<br>

Minimal, high-performance Python framework for AI model serving (Lightning AI).

```
  Quality   █████▓░░░░  58/100
  Stars     ⭐ 3,858 (-1 last 30d)
  Activity  🟢 Dec 2025
  License   Apache-2.0
  Tags      ai · api · artificial-intelligence · deep-learning · developer-tools · fastapi · rest-api · serving · web
```

</details>

<details><summary>🟡 <b>53</b> <b><a href="https://github.com/ModelTC/LightLLM">LightLLM</a></b> <code>⭐ 4.0K</code> <code>Apache-2.0</code> Lightweight LLM inference and serving framework with</summary>

<br>

Lightweight LLM inference and serving framework with continuous batching, tensor parallelism, and efficient memory management.

```
  Quality   █████░░░░░  53/100
  Stars     ⭐ 3,996 (+0 last 30d)
  Activity  🟡 Sep 2025
  License   Apache-2.0
  Tags      deep-learning · gpt · llama · llm · model-serving · nlp · openai-triton
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated Monitoring and Observability

*Automated drift detection, performance monitoring, and quality assurance for deployed models.*

<details><summary>🟢 <b>66</b> 🥇 <b><a href="https://github.com/evidentlyai/evidently">Evidently</a></b> <code>⭐ 7.4K</code> <code>Apache-2.0</code> ML and LLM observability with 100+ metrics</summary>

<br>

ML and LLM observability with 100+ metrics for evaluating, testing, and monitoring any AI system in production.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 7,376 (+2 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      data-drift · data-quality · data-science · data-validation · generative-ai · hacktoberfest · html-report · jupyter-notebook · llm · llmops · machine-learning · mlops · model-monitoring · pandas-dataframe
```

</details>

<details><summary>🟢 <b>66</b> 🥈 <b><a href="https://github.com/traceloop/openllmetry">OpenLLMetry</a></b> <code>⭐ 7.0K</code> <code>Apache-2.0</code> OpenTelemetry-based observability for LLM applications with automatic</summary>

<br>

OpenTelemetry-based observability for LLM applications with automatic instrumentation for LangChain, LlamaIndex, and OpenAI SDK.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 6,985 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      artifical-intelligence · datascience · generative-ai · good-first-issue · good-first-issues · help-wanted · llm · llmops · metrics · ml · model-monitoring · monitoring · observability · open-source · open-telemetry · opentelemetry · opentelemetry-python · python
```

</details>

<details><summary>🟢 <b>65</b> 🥉 <b><a href="https://github.com/Giskard-AI/giskard-oss">Giskard</a></b> <code>⭐ 5.2K</code> <code>Apache-2.0</code> Testing and evaluation for ML and LLM</summary>

<br>

Testing and evaluation for ML and LLM models covering bias, performance regression, and security vulnerabilities.

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 5,224 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      agent-evaluation · ai-red-team · ai-security · ai-testing · fairness-ai · llm · llm-eval · llm-evaluation · llm-security · llmops · ml-testing · ml-validation · mlops · rag-evaluation · red-team-tools · responsible-ai · trustworthy-ai
```

</details>

<details><summary>🟢 <b>56</b> <b><a href="https://github.com/SeldonIO/alibi-detect">Alibi Detect</a></b> <code>⭐ 2.5K</code> <code>NOASSERTION</code> Outlier, adversarial, and drift detection algorithms for</summary>

<br>

Outlier, adversarial, and drift detection algorithms for tabular, text, image, and time-series data (Seldon).

```
  Quality   █████▓░░░░  56/100
  Stars     ⭐ 2,509 (+0 last 30d)
  Activity  🟢 Dec 2025
  License   NOASSERTION
  Tags      adversarial · anomaly · concept-drift · data-drift · detection · drift-detection · images · outlier · semi-supervised-learning · tabular-data · text · time-series · unsupervised-learning
```

</details>

<details><summary>🟡 <b>54</b> <b><a href="https://github.com/Helicone/helicone">Helicone</a></b> <code>⭐ 5.5K</code> <code>Apache-2.0</code> LLM observability platform with one-line integration for</summary>

<br>

LLM observability platform with one-line integration for cost tracking, latency analysis, prompt versioning, and usage dashboards (YC W23).

```
  Quality   █████░░░░░  54/100
  Stars     ⭐ 5,462 (+2 last 30d)
  Activity  🟡 Aug 2025
  License   Apache-2.0
  Tags      agent-monitoring · analytics · evaluation · gpt · langchain · large-language-models · llama-index · llm · llm-cost · llm-evaluation · llm-observability · llmops · monitoring · open-source · openai · playground · prompt-engineering · prompt-management · ycombinator
```

</details>

<details><summary>🟡 <b>51</b> <b><a href="https://github.com/NannyML/nannyml">NannyML</a></b> <code>⭐ 2.1K</code> <code>Apache-2.0</code> Estimate model performance without ground truth labels</summary>

<br>

Estimate model performance without ground truth labels and link data drift directly to accuracy degradation.

```
  Quality   █████░░░░░  51/100
  Stars     ⭐ 2,136 (+0 last 30d)
  Activity  🟡 Jul 2025
  License   Apache-2.0
  Tags      data-analysis · data-drift · data-science · deep-learning · jupyter-notebook · machine-learning · machinelearning · ml · mlops · model-monitoring · monitoring · performance-estimation · performance-monitoring · postdeploymentdatascience · python · visualization
```

</details>

---

<details><summary>🔴 <b>49</b> 💤 <i><a href="https://github.com/deepchecks/deepchecks">Deepchecks</a></i> <code>⭐ 4.0K</code> <code>NOASSERTION</code> Holistic ML validation covering data integrity, drift</summary>

<br>

*Holistic ML validation covering data integrity, drift detection, and model evaluation in a single suite. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  49/100
  Stars     ⭐ 4,002 (n/a)
  Activity  🔴 Dec 2024 - unmaintained 12+ months
  License   NOASSERTION
  Tags      data-drift · data-science · data-validation · deep-learning · html-report · jupyter-notebook · machine-learning · ml · mlops · model-monitoring · model-validation · pandas-dataframe · python · pytorch
```

</details>

<details><summary>🔴 <b>48</b> 💤 <i><a href="https://github.com/whylabs/whylogs">WhyLogs</a></i> <code>⭐ 2.8K</code> <code>Apache-2.0</code> Lightweight data logging library that profiles datasets</summary>

<br>

*Lightweight data logging library that profiles datasets for drift detection without storing raw data. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████▓░░░░░  48/100
  Stars     ⭐ 2,811 (n/a)
  Activity  🔴 Dec 2024 - unmaintained 12+ months
  License   Apache-2.0
  Tags      ai-pipelines · analytics · approximate-statistics · calculate-statistics · constraints · data-constraints · data-pipeline · data-quality · data-science · dataops · dataset · logging · machine-learning · ml-pipelines · mlops · model-performance · python · statistical-properties
```

</details>


**[⬆ Back to Contents](#contents)**

## Automated AI Safety

*Automated testing, red-teaming, and guardrails for ensuring AI system safety and reliability.*

<details><summary>🟢 <b>66</b> 🥇 <b><a href="https://github.com/NVIDIA/garak">Garak</a></b> <code>⭐ 7.5K</code> <code>Apache-2.0</code> LLM vulnerability scanner with 100+ attack modules</summary>

<br>

LLM vulnerability scanner with 100+ attack modules covering prompt injection, data leakage, and jailbreaking.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 7,492 (+5 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      ai · llm-evaluation · llm-security · security-scanners · vulnerability-assessment
```

</details>

<details><summary>🟢 <b>66</b> 🥈 <b><a href="https://github.com/guardrails-ai/guardrails">Guardrails AI</a></b> <code>⭐ 6.6K</code> <code>Apache-2.0</code> Framework for adding structural and semantic validation</summary>

<br>

Framework for adding structural and semantic validation guardrails to LLM outputs.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 6,646 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      ai · foundation-model · gpt-3 · llm · openai
```

</details>

<details><summary>🟢 <b>66</b> 🥉 <b><a href="https://github.com/katanemo/plano">Plano</a></b> <code>⭐ 6.2K</code> <code>Apache-2.0</code> AI-native proxy with built-in orchestration, safety controls</summary>

<br>

AI-native proxy with built-in orchestration, safety controls, and observability for agentic applications.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 6,226 (+4 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      ai-gateway · ai-gateway-support · envoy · envoyproxy · gateway · generative-ai · llm-gateway · llm-inference · llm-proxy · llm-routing · llmops · llms · openai · prompt · proxy · proxy-server · routing
```

</details>

<details><summary>🟢 <b>65</b> <b><a href="https://github.com/NVIDIA-NeMo/Guardrails">NeMo Guardrails</a></b> <code>⭐ 5.9K</code> <code>NOASSERTION</code> Programmable safety rails for LLM-based conversational systems</summary>

<br>

Programmable safety rails for LLM-based conversational systems with topical and safety controls (NVIDIA).

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 5,937 (+2 last 30d)
  Activity  🟢 Mar 2026
  License   NOASSERTION
  Tags      agents · generative-ai · guardrails · llm-safety · llm-security · llms · nvidia · python · safety
```

</details>

<details><summary>🟢 <b>55</b> <b><a href="https://github.com/confident-ai/deepteam">DeepTeam</a></b> <code>⭐ 1.5K</code> <code>↗️ +14</code> <code>Apache-2.0</code> Red-teaming framework for systematically testing LLM vulnerabilities</summary>

<br>

Red-teaming framework for systematically testing LLM vulnerabilities across multiple attack vectors.

```
  Quality   █████▓░░░░  55/100
  Stars     ⭐ 1,504 (+14 last 30d)
  Activity  🟢 Nov 2025
  License   Apache-2.0
  Tags      hacktoberfest · llm-guardrails · llm-red-teaming · llm-safety · python
```

</details>

<details><summary>🟡 <b>52</b> <b><a href="https://github.com/protectai/llm-guard">LLM Guard</a></b> <code>⭐ 2.8K</code> <code>MIT</code> Security toolkit with input/output scanners for prompt</summary>

<br>

Security toolkit with input/output scanners for prompt injection, data leakage, toxic content, and other safety risks in production LLM applications.

```
  Quality   █████░░░░░  52/100
  Stars     ⭐ 2,788 (+0 last 30d)
  Activity  🟡 Sep 2025
  License   MIT
  Tags      adversarial-machine-learning · chatgpt · large-language-models · llm · llm-security · llmops · prompt-engineering · prompt-injection · security-tools · transformers
```

</details>


**[⬆ Back to Contents](#contents)**

## AutoML Benchmarks

*Standardized frameworks and datasets for evaluating and comparing AutoML systems.*

<details><summary>🟢 <b>60</b> 🥇 <b><a href="https://github.com/openai/mle-bench">MLE-Bench</a></b> <code>⭐ 1.4K</code> <code>NOASSERTION</code> Benchmark using 75 Kaggle competitions to evaluate</summary>

<br>

Benchmark using 75 Kaggle competitions to evaluate ML engineering agents (OpenAI).

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 1,448 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   NOASSERTION
```

</details>

<details><summary>🟢 <b>54</b> 🥈 <b><a href="https://github.com/autogluon/tabarena">TabArena</a></b> <code>⭐ 207</code> <code>Apache-2.0</code> Living benchmark for tabular ML with continuously</summary>

<br>

Living benchmark for tabular ML with continuously maintained leaderboard and best-practice evaluation (NeurIPS 2025 Spotlight).

```
  Quality   █████░░░░░  54/100
  Stars     ⭐ 207 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
```

</details>

<details><summary>🟢 <b>51</b> 🥉 <b><a href="https://github.com/D-X-Y/NAS-Bench-201">NAS-Bench-201</a></b> <code>⭐ 644</code> <code>MIT</code> Reproducible benchmark with 15,625 evaluated architectures across</summary>

<br>

Reproducible benchmark with 15,625 evaluated architectures across three datasets for fair NAS comparison.

```
  Quality   █████░░░░░  51/100
  Stars     ⭐ 644 (+0 last 30d)
  Activity  🟢 Oct 2025
  License   MIT
  Tags      automl · dataset · nas · nas-bench-201 · pytorch
```

</details>

---

<details><summary>🔴 <b>41</b> 💤 <i><a href="https://github.com/openml/automlbenchmark">AMLB</a></i> <code>⭐ 459</code> <code>MIT</code> Standard AutoML benchmark comparing frameworks across 104</summary>

<br>

*Standard AutoML benchmark comparing frameworks across 104 classification and regression tasks (OpenML). **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  41/100
  Stars     ⭐ 459 (n/a)
  Activity  🔴 Sep 2023 - unmaintained 12+ months
  License   MIT
  Tags      automl · benchmark · machine-learning
```

</details>

<details><summary>🔴 <b>33</b> 💤 <i><a href="https://github.com/google-research/nasbench">NAS-Bench-101</a></i> <code>⭐ 717</code> <code>Apache-2.0</code> Benchmark dataset with 423,624 evaluated neural architectures</summary>

<br>

*Benchmark dataset with 423,624 evaluated neural architectures for efficient NAS research (Google). **Archived.***

```
  Quality   ███░░░░░░░  33/100
  Stars     ⭐ 717 (n/a)
  Activity  🔴 Nov 2019 - archived
  License   Apache-2.0
```

</details>


**[⬆ Back to Contents](#contents)**

## MLOps and Experiment Tracking

*Platforms for managing the ML lifecycle, tracking experiments, and orchestrating pipelines.*

<details><summary>🟢 <b>73</b> 🥇 <b><a href="https://github.com/ray-project/ray">Ray</a></b> <code>⭐ 42.0K</code> <code>↗️ +12</code> <code>Apache-2.0</code> Unified AI compute engine for distributed training</summary>

<br>

Unified AI compute engine for distributed training, tuning, and model serving with Ray Train, Ray Tune, and Ray Serve.

```
  Quality   ███████░░░  73/100
  Stars     ⭐ 42,015 (+12 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      data-science · deep-learning · deployment · distributed · hyperparameter-optimization · hyperparameter-search · large-language-models · llm · llm-inference · llm-serving · machine-learning · optimization · parallel · python · pytorch · ray · reinforcement-learning · rllib · serving · tensorflow
```

</details>

<details><summary>🟢 <b>72</b> 🥈 <b><a href="https://github.com/langfuse/langfuse">Langfuse</a></b> <code>⭐ 24.5K</code> <code>↗️ +41</code> <code>NOASSERTION</code> Open-source LLM engineering platform with tracing, evaluations</summary>

<br>

Open-source LLM engineering platform with tracing, evaluations, prompt management, and cost analytics.

```
  Quality   ███████░░░  72/100
  Stars     ⭐ 24,520 (+41 last 30d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      analytics · autogen · evaluation · langchain · large-language-models · llama-index · llm · llm-evaluation · llm-observability · llmops · monitoring · observability · open-source · openai · playground · prompt-engineering · prompt-management · self-hosted · ycombinator
```

</details>

<details><summary>🟢 <b>71</b> 🥉 <b><a href="https://github.com/mlflow/mlflow">MLflow</a></b> <code>⭐ 25.2K</code> <code>↗️ +18</code> <code>Apache-2.0</code> End-to-end ML lifecycle platform with experiment tracking</summary>

<br>

End-to-end ML lifecycle platform with experiment tracking, model registry, and integrated prompt optimization.

```
  Quality   ███████░░░  71/100
  Stars     ⭐ 25,199 (+18 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      agentops · agents · ai · ai-governance · apache-spark · evaluation · langchain · llm-evaluation · llmops · machine-learning · ml · mlflow · mlops · model-management · observability · open-source · openai · prompt-engineering
```

</details>

<details><summary>🟢 <b>70</b> <b><a href="https://github.com/PrefectHQ/prefect">Prefect</a></b> <code>⭐ 22.1K</code> <code>Apache-2.0</code> Modern data workflow automation with retries, caching</summary>

<br>

Modern data workflow automation with retries, caching, and real-time logging.

```
  Quality   ███████░░░  70/100
  Stars     ⭐ 22,095 (+5 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      automation · data · data-engineering · data-ops · data-science · infrastructure · ml-ops · observability · orchestration · pipeline · prefect · python · workflow · workflow-engine
```

</details>

<details><summary>🟢 <b>69</b> <b><a href="https://github.com/comet-ml/opik">Opik</a></b> <code>⭐ 18.7K</code> <code>Apache-2.0</code> LLM debugging, evaluation, and monitoring platform with</summary>

<br>

LLM debugging, evaluation, and monitoring platform with detailed tracing and quality dashboards (Comet).

```
  Quality   ██████▓░░░  69/100
  Stars     ⭐ 18,702 (+6 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      evaluation · hacktoberfest · hacktoberfest2025 · langchain · llama-index · llm · llm-evaluation · llm-observability · llmops · open-source · openai · playground · prompt-engineering
```

</details>

<details><summary>🟢 <b>69</b> <b><a href="https://github.com/treeverse/dvc">DVC</a></b> <code>⭐ 15.5K</code> <code>Apache-2.0</code> Version control for data and models with</summary>

<br>

Version control for data and models with built-in experiment tracking and pipeline management.

```
  Quality   ██████▓░░░  69/100
  Stars     ⭐ 15,513 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      ai · data-science · data-version-control · developer-tools · machine-learning · reproducibility · unstructured-data
```

</details>

<details><summary>🟢 <b>69</b> <b><a href="https://github.com/dagster-io/dagster">Dagster</a></b> <code>⭐ 15.2K</code> <code>Apache-2.0</code> Asset-centric orchestration built for ML pipelines with</summary>

<br>

Asset-centric orchestration built for ML pipelines with data lineage tracking and observability.

```
  Quality   ██████▓░░░  69/100
  Stars     ⭐ 15,246 (+1 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      analytics · dagster · data-engineering · data-integration · data-orchestrator · data-pipelines · data-science · etl · metadata · mlops · orchestration · python · scheduler · workflow · workflow-automation
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/wandb/wandb">W&B</a></b> <code>⭐ 11.0K</code> <code>MIT</code> Experiment tracking, visualization, and collaboration platform for</summary>

<br>

Experiment tracking, visualization, and collaboration platform for ML teams (Weights and Biases).

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 10,973 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      ai · collaboration · data-science · data-versioning · deep-learning · experiment-track · hyperparameter-optimization · hyperparameter-search · hyperparameter-tuning · jax · keras · machine-learning · ml-platform · mlops · model-versioning · pytorch · reinforcement-learning · reproducibility · tensorflow
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/kedro-org/kedro">Kedro</a></b> <code>⭐ 10.8K</code> <code>Apache-2.0</code> Framework for reproducible, maintainable ML pipelines with</summary>

<br>

Framework for reproducible, maintainable ML pipelines with clean coding patterns.

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 10,813 (+2 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      experiment-tracking · hacktoberfest · kedro · machine-learning · machine-learning-engineering · mlops · pipeline · python
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/Netflix/metaflow">Metaflow</a></b> <code>⭐ 10.0K</code> <code>Apache-2.0</code> Human-centric framework for managing real-life data science</summary>

<br>

Human-centric framework for managing real-life data science and ML projects at scale (Netflix).

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 10,016 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      agents · ai · aws · azure · cost-optimization · datascience · distributed-training · gcp · generative-ai · high-performance-computing · kubernetes · llm · llmops · machine-learning · ml · ml-infrastructure · ml-platform · mlops · model-management · python
```

</details>

<details><summary>🟢 <b>67</b> <b><a href="https://github.com/Arize-ai/phoenix">Phoenix</a></b> <code>⭐ 9.2K</code> <code>NOASSERTION</code> AI observability platform with OpenTelemetry-native tracing and</summary>

<br>

AI observability platform with OpenTelemetry-native tracing and LLM evaluation dashboards (Arize).

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 9,201 (+5 last 30d)
  Activity  🟢 Apr 2026
  License   NOASSERTION
  Tags      agents · ai-monitoring · ai-observability · aiengineering · anthropic · datasets · evals · langchain · llamaindex · llm-eval · llm-evaluation · llmops · llms · openai · prompt-engineering · smolagents
```

</details>

<details><summary>🟢 <b>66</b> <b><a href="https://github.com/feast-dev/feast">Feast</a></b> <code>⭐ 6.9K</code> <code>Apache-2.0</code> Open-source feature store for managing and serving</summary>

<br>

Open-source feature store for managing and serving ML features in real-time and batch inference.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 6,913 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      big-data · data-engineering · data-quality · data-science · feature-store · features · machine-learning · ml · mlops · python
```

</details>

<details><summary>🟢 <b>66</b> <b><a href="https://github.com/clearml/clearml">ClearML</a></b> <code>⭐ 6.6K</code> <code>Apache-2.0</code> Unified experiment manager, pipeline orchestrator, and data/model</summary>

<br>

Unified experiment manager, pipeline orchestrator, and data/model management platform.

```
  Quality   ██████▓░░░  66/100
  Stars     ⭐ 6,613 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      ai · clearml · control · deep-learning · deeplearning · devops · experiment · experiment-manager · k8s · machine-learning · machinelearning · mlops · trains · trainsai · version · version-control
```

</details>

<details><summary>🟢 <b>65</b> <b><a href="https://github.com/zenml-io/zenml">ZenML</a></b> <code>⭐ 5.3K</code> <code>Apache-2.0</code> Framework for building portable, production-ready ML pipelines</summary>

<br>

Framework for building portable, production-ready ML pipelines that run on any infrastructure.

```
  Quality   ██████▓░░░  65/100
  Stars     ⭐ 5,319 (+0 last 30d)
  Activity  🟢 Mar 2026
  License   Apache-2.0
  Tags      agentops · agents · ai · automl · data-science · deep-learning · devops-tools · genai · llm · llmops · machine-learning · metadata-tracking · ml · mlops · pipelines · production-ready · pytorch · tensorflow · workflow · zenml
```

</details>

<details><summary>🟡 <b>55</b> <b><a href="https://github.com/aimhubio/aim">Aim</a></b> <code>⭐ 6.1K</code> <code>Apache-2.0</code> Self-hosted experiment tracker with a high-performance UI</summary>

<br>

Self-hosted experiment tracker with a high-performance UI that handles 10,000+ training runs.

```
  Quality   █████▓░░░░  55/100
  Stars     ⭐ 6,076 (+0 last 30d)
  Activity  🟡 May 2025
  License   Apache-2.0
  Tags      ai · data-science · data-visualization · experiment-tracking · machine-learning · metadata · metadata-tracking · ml · mlflow · mlops · prompt-engineering · python · pytorch · tensorboard · tensorflow · visualization
```

</details>

---

<details><summary>🔴 <b>54</b> 💤 <i><a href="https://github.com/kubeflow/kubeflow">Kubeflow</a></i> <code>⭐ 15.6K</code> <code>Apache-2.0</code> ML toolkit on Kubernetes for building portable</summary>

<br>

*ML toolkit on Kubernetes for building portable, scalable ML pipelines and training workflows. **Unmaintained - no commits for 12+ months.***

```
  Quality   █████░░░░░  54/100
  Stars     ⭐ 15,558 (n/a)
  Activity  🔴 Mar 2025 - unmaintained 12+ months
  License   Apache-2.0
  Tags      google-kubernetes-engine · jupyter · kubeflow · kubernetes · machine-learning · minikube · ml · notebook · tensorflow
```

</details>


**[⬆ Back to Contents](#contents)**

## Related Awesome Lists

<details><summary>🟢 <b>74</b> 🥇 <b><a href="https://github.com/josephmisiti/awesome-machine-learning">awesome-machine-learning</a></b> <code>⭐ 72.2K</code> <code>NOASSERTION</code> Curated list of ML frameworks, libraries, and</summary>

<br>

Curated list of ML frameworks, libraries, and software organized by language.

```
  Quality   ███████░░░  74/100
  Stars     ⭐ 72,194 (+6 last 30d)
  Activity  🟢 Mar 2026
  License   NOASSERTION
```

</details>

<details><summary>🟢 <b>68</b> 🥈 <b><a href="https://github.com/steven2358/awesome-generative-ai">awesome-generative-ai</a></b> <code>⭐ 11.8K</code> <code>CC0-1.0</code> Curated list of modern generative AI projects</summary>

<br>

Curated list of modern generative AI projects and services.

```
  Quality   ██████▓░░░  68/100
  Stars     ⭐ 11,775 (+0 last 30d)
  Activity  🟢 Apr 2026
  License   CC0-1.0
  Tags      ai · artificial-intelligence · awesome · awesome-list · generative-ai · generative-art · large-language-models · llm
```

</details>

<details><summary>🟢 <b>67</b> 🥉 <b><a href="https://github.com/EthicalML/awesome-production-machine-learning">awesome-production-machine-learning</a></b> <code>⭐ 20.3K</code> <code>MIT</code> Curated list of tools for deploying, monitoring</summary>

<br>

Curated list of tools for deploying, monitoring, and scaling ML in production.

```
  Quality   ██████▓░░░  67/100
  Stars     ⭐ 20,347 (+1 last 30d)
  Activity  🟢 Mar 2026
  License   MIT
  Tags      awesome · awesome-list · data-mining · deep-learning · explainability · interpretability · large-scale-machine-learning · large-scale-ml · machine-learning · machine-learning-operations · ml-operations · ml-ops · mlops · privacy-preserving · privacy-preserving-machine-learning · privacy-preserving-ml · production-machine-learning · production-ml · responsible-ai
```

</details>

<details><summary>🟡 <b>60</b> <b><a href="https://github.com/Hannibal046/Awesome-LLM">awesome-llm</a></b> <code>⭐ 26.6K</code> <code>CC0-1.0</code> Curated list of large language model resources</summary>

<br>

Curated list of large language model resources covering papers, tools, and applications.

```
  Quality   ██████░░░░  60/100
  Stars     ⭐ 26,613 (+3 last 30d)
  Activity  🟡 Jul 2025
  License   CC0-1.0
```

</details>

<details><summary>🟡 <b>50</b> <b><a href="https://github.com/ChristosChristofidis/awesome-deep-learning">awesome-deep-learning</a></b> <code>⭐ 27.9K</code> Curated list of deep learning tutorials, projects</summary>

<br>

Curated list of deep learning tutorials, projects, and communities.

```
  Quality   █████░░░░░  50/100
  Stars     ⭐ 27,863 (+0 last 30d)
  Activity  🟡 May 2025
  License   -
  Tags      awesome · awesome-list · deep-learning · deep-learning-tutorial · deep-networks · face-images · machine-learning · neural-network · recurrent-networks
```

</details>

---

<details><summary>🔴 <b>43</b> 💤 <i><a href="https://github.com/visenger/awesome-mlops">awesome-mlops</a></i> <code>⭐ 13.8K</code> Curated list of MLOps tools and best</summary>

<br>

*Curated list of MLOps tools and best practices for production ML. **Unmaintained - no commits for 12+ months.***

```
  Quality   ████░░░░░░  43/100
  Stars     ⭐ 13,845 (n/a)
  Activity  🔴 Nov 2024 - unmaintained 12+ months
  License   -
  Tags      ai · data-science · devops · engineering · federated-learning · machine-learning · ml · mlops · software-engineering
```

</details>


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
