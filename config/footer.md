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
