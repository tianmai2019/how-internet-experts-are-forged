// ⚠️ 英文问题数据（人工翻译维护）。繁体版由 scripts/build-questions-data.js 生成；
// 本文件不自动生成 —— 新增/修改英文文案请直接编辑这里。
// 结构与 questions.js 保持一致，供 en/ 下的 knowledge-graph.html 与 articles/question.html 共用。

const QUESTIONS = {
    1: { text: "Why does a page appear on your screen the moment you type a URL?", level: 1 },
    2: { text: "Why does a message you send arrive on someone else's phone almost instantly?", level: 1 },
    3: { text: "Why do platforms seem to know you better and better over time?", level: 1 },
    4: { text: "Why does the map app always know where you are?", level: 1 },
    5: { text: "Why do things you \"deleted\" sometimes feel like they never really went away?", level: 1 },
    6: { text: "Why can AI answer you as if you were talking to a person?", level: 1 },
    7: { text: "How is a web page actually made?", level: 2 },
    8: { text: "What do frontend and backend actually each do?", level: 2 },
    9: { text: "How does the browser turn the page you wrote into pixels?", level: 2 },
    10: { text: "When you click a button, where does the data actually go?", level: 2 },
    11: { text: "Sign up, log in, comment, like, place an order — how are these features actually built?", level: 2 },
    12: { text: "What is a database actually storing?", level: 2 },
    13: { text: "When you type a URL into a browser, what actually happens behind the scenes?", level: 3 },
    14: { text: "Why do some sites load in a blink while others are always slow?", level: 3 },
    15: { text: "Why does a system that ran fine yesterday start timing out, erroring, and crashing under traffic?", level: 3 },
    16: { text: "Why does a \"simple\" like, comment, or checkout button need so many moving parts behind it?", level: 3 },
    17: { text: "Why do big systems keep talking about caches, queues, load balancing, rate limiting, graceful degradation, and circuit breaking?", level: 3 },
    18: { text: "Why is the database so often the bottleneck?", level: 3 },
    19: { text: "Why can one slow API drag the entire business path down with it?", level: 3 },
    20: { text: "Why does caching make systems dramatically faster?", level: 3 },
    21: { text: "Why do message queues help with shaving peaks and filling troughs?", level: 3 },
    22: { text: "Why can load balancing let one service absorb huge amounts of traffic?", level: 3 },
    23: { text: "Why are distributed systems so much harder than single-machine ones?", level: 3 },
    24: { text: "Why is the hardest part of a high-concurrency system not the features but keeping it stable?", level: 3 },
    25: { text: "Why do large sites keep investing in monitoring, logging, tracing, and failure drills?", level: 3 },
    26: { text: "Why is there no silver bullet in system design?", level: 4 },
    27: { text: "Why doesn't the most \"advanced\" architecture always fit the business you're actually in?", level: 4 },
    28: { text: "Why isn't a monolith automatically outdated, and why aren't microservices automatically better?", level: 4 },
    29: { text: "Why do consistency, performance, availability, cost, and complexity always end up trading off against each other?", level: 4 },
    30: { text: "Why do plans that look great on the whiteboard often stop being worth it in production?", level: 4 },
    31: { text: "Why does stability tend to matter more than \"clever\" design?", level: 4 },
    32: { text: "Why is tech debt never just a code problem — it's time, organization, and business piling on top of each other?", level: 4 },
    33: { text: "Why isn't a recommendation system just delivering content — why is it also shaping your attention?", level: 5 },
    34: { text: "Why aren't platforms just offering services — why are they also writing the rules?", level: 5 },
    35: { text: "Why does a button's position, a recommendation strategy, or an interaction mechanic change how people behave?", level: 5 },
    36: { text: "Why does internet product design end up shaping people's emotions, expression, and judgment?", level: 5 },
    37: { text: "Why does an org chart end up shaping the system's architecture?", level: 5 },
    38: { text: "Why do business goals so often decide the tech direction, and not the other way around?", level: 5 },
    39: { text: "Why do internet systems ultimately change not just how information moves, but how people relate to the world?", level: 5 },
    40: { text: "Why does AI seem to understand you when it doesn't actually understand you?", level: 6 },
    41: { text: "Why can AI sound fluent and still be wrong?", level: 6 },
    42: { text: "Why is generative AI fundamentally different from traditional software systems?", level: 6 },
    43: { text: "Why are AI outputs probabilistic instead of deterministic like traditional systems?", level: 6 },
    44: { text: "Why does AI feeling more human make it easier for people to misjudge what it can actually do?", level: 6 },
    45: { text: "Why hasn't AI made the internet simpler — why has it just buried the complexity deeper?", level: 6 },
    46: { text: "Why is there a whole system path hidden behind a single button?", level: 0 },
    47: { text: "Why does a system, as it grows, stop looking like a code problem and start looking like a complexity problem?", level: 0 },
    48: { text: "Why does going deeper into technology eventually lead you toward understanding people, organizations, and society?", level: 0 },
    49: { text: "Why is the real \"mental map of the internet\" not scattered facts, but the structure that connects them?", level: 0 },
    50: { text: "Why does it work this way?", level: 0 }
};

const LEVEL_NAMES = {
    1: "The User's View · A world that responds to you",
    2: "The Beginner Coder's View · Something people build",
    3: "The Engineer's View · A system in motion",
    4: "The Senior Engineer's View · A system of trade-offs",
    5: "The Grandmaster's View · A system that shapes reality",
    6: "The AI-Era View · A system you can talk to",
    0: "Wrap-up questions"
};

const LEVEL_ICONS = {
    1: "🎯",
    2: "🔨",
    3: "🌊",
    4: "⚖️",
    5: "👑",
    6: "💬",
    0: "🌟"
};
