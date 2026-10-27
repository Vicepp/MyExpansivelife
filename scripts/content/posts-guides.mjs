/**
 * Keyword-first guides (October 2026).
 *
 * Written to the Google-reach brief in the blog-post skill: the title is the
 * phrase people type, every guide has a table, an embedded My Expansive Life
 * video and a "Frequently asked questions" section (which src/lib/faq.js turns
 * into FAQPage structured data), and posts link to each other in two topic
 * clusters — LinkedIn visibility and wealth.
 *
 * Unlike the seed batch, these carry their own publish dates.
 */

const AUTHOR = { name: 'Dr. Nkem Ezeamama', uid: 'seed' }

/** Same markup the admin editor's YouTube node produces, so it styles the same. */
function video(id, title) {
  return `<div data-youtube-video=""><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" width="840" height="472" allowfullscreen="true" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe></div>`
}

const EXT = 'target="_blank" rel="noopener noreferrer"'

export const GUIDE_POSTS = [
  // ── LinkedIn cluster ──────────────────────────────────────────────────────
  {
    slug: 'how-to-get-more-views-on-linkedin',
    title: 'How to Get More Views on LinkedIn: 9 Tips That Work',
    category: 'LinkedIn Strategy',
    tags: ['more views on linkedin', 'linkedin reach', 'linkedin engagement', 'linkedin tips'],
    readMinutes: 7,
    author: AUTHOR,
    coverAlt: 'A laptop showing an analytics dashboard with rising charts',
    publishedAt: '2026-10-27T09:00:00',
    excerpt:
      'Want more views on LinkedIn? Nine practical tips for more reach and engagement, from your first line to the first hour after you post. No paid ads.',
    content: `
<p>If you want more views on LinkedIn, the answer is rarely "post more". It is posting in a way the feed can recognise as worth showing — and that comes down to a handful of habits most professionals have never been taught.</p>

<p>Below are nine tips that reliably increase LinkedIn views, in the order they matter. None of them need paid ads, a design team or an hour a day.</p>

<h2>Why are my LinkedIn posts getting so few views?</h2>

<p>LinkedIn first shows a new post to a small slice of your network. If those people stop scrolling, read and respond, it shows the post to more of them, then to their networks. If they scroll past, distribution stops early. Low views almost always mean the first audience did not engage — not that LinkedIn is hiding you. We break this down in detail in <a href="/blogs/how-the-linkedin-algorithm-actually-works">how the LinkedIn algorithm actually works</a>.</p>

<p>So every tip below does one of two things: earns that first stop-and-read, or turns it into a response.</p>

<h2>9 tips to get more views on LinkedIn</h2>

<p><strong>1. Write the first two lines for a stranger.</strong> Only the opening shows before "…see more". Lead with a specific claim, number or tension — "I turned down a promotion last year. Here is why." — not a greeting or context.</p>

<p><strong>2. Write for one person.</strong> Posts aimed at "everyone on LinkedIn" read as generic and get scrolled past. Picture one reader with one problem, and write to them.</p>

<p><strong>3. Rotate post types.</strong> Stories build connection, insights build authority, how-tos get saved, and questions start conversations. Rotating them keeps your feed from feeling repetitive. The full system is in <a href="/blogs/what-to-post-on-linkedin-five-post-types">what to post on LinkedIn: 5 post types</a>.</p>

<p><strong>4. Make it easy to read on a phone.</strong> Most people read LinkedIn on mobile. Short paragraphs, one idea each, plenty of white space. A wall of text is a reason to keep scrolling.</p>

<p><strong>5. Keep links out of the post body.</strong> Posts that send people off LinkedIn tend to reach fewer people. If a link is essential, say it is in the comments, or share it after the conversation has started.</p>

<p><strong>6. End with a question people can actually answer.</strong> "Thoughts?" is too vague. "Which of these three would you cut first?" gets replies, and replies extend reach.</p>

<p><strong>7. Stay for the first hour.</strong> Reply to every early comment with something substantial. Each reply is another signal that the post is worth showing — and it turns readers into conversations.</p>

<p><strong>8. Comment on other people's posts before you post your own.</strong> Ten minutes of thoughtful comments in your niche puts your name in front of their audiences and warms up your own. Here is <a href="/blogs/how-to-comment-on-linkedin-to-build-authority">how to comment so it builds authority</a>.</p>

<p><strong>9. Post consistently, not constantly.</strong> Three good posts a week, every week, beats a burst of daily posting followed by a month of silence. Consistency is what builds an audience that looks for you.</p>

<h2>Which LinkedIn tips have the biggest effect?</h2>

<p>If you only have time for some of them, start at the top of this table.</p>

<table>
  <thead>
    <tr><th>Tip</th><th>What it changes</th><th>Effort</th></tr>
  </thead>
  <tbody>
    <tr><td>A stronger first two lines</td><td>How many people stop and expand the post</td><td>5 minutes per post</td></tr>
    <tr><td>Replying in the first hour</td><td>Comments, conversations and onward reach</td><td>15–30 minutes</td></tr>
    <tr><td>Commenting on others first</td><td>Visibility with new audiences</td><td>10 minutes a day</td></tr>
    <tr><td>Rotating post types</td><td>Variety, saves and repeat readers</td><td>Planning once a week</td></tr>
    <tr><td>Mobile-friendly formatting</td><td>How far people read</td><td>2 minutes per post</td></tr>
    <tr><td>A consistent schedule</td><td>Followers who expect and look for you</td><td>Ongoing</td></tr>
  </tbody>
</table>

<h2>Does posting video or going live get more views on LinkedIn?</h2>

<p>Video holds attention well when it is short, captioned and gets to the point in the first few seconds. LinkedIn Live adds a real-time audience and notifies your network when you go live — LinkedIn's own <a href="https://www.linkedin.com/help/linkedin/answer/a554398" ${EXT}>LinkedIn Live FAQ</a> covers how it works and who can use it.</p>

<p>But format is secondary. A clear idea in plain text will outperform a vague video. Start with the writing, then add video once you know what your audience responds to.</p>

<p>Here is how one well-written post turned into real business — the point of chasing views in the first place:</p>

${video('zc9V3jmUxBY', 'How to Turn LinkedIn Posts Into Business Opportunities')}

<h2>How do I turn more views into real opportunities?</h2>

<p>Views are only useful if the right people see them and know what to do next. That is a profile job: when someone likes a post and clicks your name, your headline and About section decide whether they connect. Make sure your <a href="/blogs/linkedin-headline-that-gets-you-found">headline says who you help and how</a>.</p>

<p>Then follow up the conversations your posts start. A comment is an opening, not an outcome — the next step is a thoughtful reply, a connection request and, where it fits, a short message.</p>

<h2>Frequently asked questions</h2>

<h3>How many times a week should I post on LinkedIn?</h3>
<p>Two to four times a week is enough for most professionals. Pick a number you can keep for three months; consistency matters more than volume.</p>

<h3>What is the best time to post on LinkedIn?</h3>
<p>Weekday mornings in your audience's time zone are a sensible default, because that is when many professionals check the feed. Test two or three slots for a few weeks and keep the one where your posts get the most early comments.</p>

<h3>Do hashtags help you get more views on LinkedIn?</h3>
<p>A few relevant hashtags can help people find a post, but they will not rescue a weak one. Use two or three specific tags at most, and spend your effort on the first two lines instead.</p>

<h3>How long does it take to get more views on LinkedIn?</h3>
<p>Most people see a difference within four to six weeks of posting consistently and engaging daily. Growth compounds: each post reaches a slightly larger and warmer audience than the last.</p>

<h2>Start with your next post</h2>

<p>Pick two tips — the first two lines and the first hour — and apply them to your next three posts. Then add the rest one at a time. If you want the full system, with templates, a content calendar and weekly feedback, that is what <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a> teaches.</p>
`.trim(),
  },

  {
    slug: 'how-to-get-clients-on-linkedin',
    title: 'How to Get Clients on LinkedIn: A Step-by-Step Guide',
    category: 'LinkedIn Strategy',
    tags: ['get clients on linkedin', 'linkedin lead generation', 'linkedin for consultants', 'client acquisition'],
    readMinutes: 7,
    author: AUTHOR,
    coverAlt: 'Two professionals shaking hands across a table',
    publishedAt: '2026-10-27T10:00:00',
    excerpt:
      'How to get clients on LinkedIn without cold pitching: a step-by-step guide to profile, content, conversations and follow-up that turns contacts into clients.',
    content: `
<p>You can get clients on LinkedIn without cold pitching, buying ads or posting every day. What it takes is a simple, repeatable path: a profile that makes the right people want to talk to you, content that shows how you think, and conversations you actually follow up.</p>

<p>This step-by-step guide covers how to get clients on LinkedIn as a consultant, coach, founder or professional with expertise to sell — in the order the steps work.</p>

<h2>Can you really get clients from LinkedIn?</h2>

<p>Yes, and for many service businesses it is the most reliable channel they have. LinkedIn is the one network where people go to think about work. Decision-makers are there, they are reachable, and they read posts from people they do not know yet.</p>

<p>What does not work is treating it like a cold-calling list. People hire someone they already trust. The whole process below is about building that trust before anyone is asked to buy.</p>

<h2>How do I get clients on LinkedIn step by step?</h2>

<p><strong>Step 1: Decide who your client is.</strong> Write down the role, the industry and the one problem you solve for them. "Founders of 10–50 person B2B companies who need a finance function" is a client. "Businesses" is not.</p>

<p><strong>Step 2: Turn your profile into a landing page.</strong> Your headline should say who you help and with what. Your About section should describe their problem in their words, show how you solve it and tell them how to reach you. Start with <a href="/blogs/linkedin-headline-that-gets-you-found">a headline that gets you found</a> and <a href="/blogs/linkedin-about-section-people-actually-read">an About section people actually read</a>. LinkedIn's own guide to <a href="https://www.linkedin.com/help/linkedin/answer/a554351" ${EXT}>creating a good profile</a> covers the basics.</p>

<p><strong>Step 3: Post what your client needs to hear.</strong> Two or three posts a week that answer the questions your clients ask before they hire someone: what does this cost, what goes wrong, what does good look like. Each one shows your judgement. <a href="/blogs/what-to-post-on-linkedin-five-post-types">These five post types</a> make it easier to keep going.</p>

<p><strong>Step 4: Connect with intent.</strong> Send a few personal connection requests a day to people who match your client profile — people who engaged with your posts first. Here is <a href="/blogs/linkedin-connection-request-that-gets-accepted">how to write a request that gets accepted</a>.</p>

<p><strong>Step 5: Start real conversations.</strong> When someone engages, reply properly, then follow up with a short message that continues the topic — not a pitch. Ask about their situation. Most clients come from these conversations, weeks after the first contact.</p>

<p><strong>Step 6: Offer a clear next step.</strong> When a conversation reaches a real problem, suggest a short call. Make it specific: what you will cover and what they will leave with.</p>

<p><strong>Step 7: Track every warm lead.</strong> A simple spreadsheet is enough: name, where they came from, the last conversation and the next step. Leads go cold because nobody follows up, not because they were not interested.</p>

<h2>What does a LinkedIn client pipeline look like?</h2>

<table>
  <thead>
    <tr><th>Stage</th><th>What you do</th><th>Time per week</th></tr>
  </thead>
  <tbody>
    <tr><td>Be found</td><td>Keep your headline, About section and Featured items current</td><td>Once, then monthly</td></tr>
    <tr><td>Be seen</td><td>Publish 2–3 useful posts</td><td>1–2 hours</td></tr>
    <tr><td>Be remembered</td><td>Comment thoughtfully on posts by clients and peers</td><td>10 minutes a day</td></tr>
    <tr><td>Connect</td><td>Send 5–10 personal connection requests</td><td>20 minutes</td></tr>
    <tr><td>Converse</td><td>Reply to comments and follow up messages</td><td>30–60 minutes</td></tr>
    <tr><td>Convert</td><td>Offer calls where there is a real problem; track every lead</td><td>As conversations allow</td></tr>
  </tbody>
</table>

<p>Three to four hours a week, done consistently, is enough to build a steady flow of enquiries for most service businesses.</p>

<h2>How do I sell on LinkedIn without being salesy?</h2>

<p>Stop pitching in the first message. Nobody wants a sales message from a stranger, and it closes the door you are trying to open. Instead, share stories that show how you work — a problem you solved, a mistake you see often, what changed for a client. People who recognise themselves in those stories reach out.</p>

<p>Dr. Nkem explains this approach in full in this webinar replay:</p>

${video('QrISqevTdKg', 'Sell Without Selling: How to Attract Clients on LinkedIn by Telling Your Story')}

<h2>Frequently asked questions</h2>

<h3>How long does it take to get clients on LinkedIn?</h3>
<p>Most people who post and engage consistently get their first warm enquiries within one to three months. The first client usually comes from a conversation, not from a single viral post.</p>

<h3>Do I need LinkedIn Premium or Sales Navigator to get clients?</h3>
<p>No. A strong profile, regular posts and thoughtful conversations work on a free account. Sales Navigator helps once you are searching for specific roles and companies at volume.</p>

<h3>Should I message people right after they connect?</h3>
<p>Only if you have something genuinely useful to say — a reply to something they posted, or a question about their work. Never send a pitch as the first message.</p>

<h3>What should I post to attract clients?</h3>
<p>Answer the questions your clients ask before they hire you, share short stories from your work, and give your honest opinion on common mistakes in your field. Clear, specific expertise attracts clients far better than general motivation.</p>

<h2>Your next step</h2>

<p>Do steps one and two this week: define your client in one sentence, then rewrite your headline and About section for them. Everything else builds on that. If you want the complete system — with DM scripts, post templates and a simple CRM — it is all inside <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a>.</p>
`.trim(),
  },

  {
    slug: 'how-to-build-a-personal-brand-on-linkedin',
    title: 'How to Build a Personal Brand on LinkedIn in 7 Steps',
    category: 'Personal Branding',
    tags: ['personal brand on linkedin', 'personal branding', 'linkedin profile', 'thought leadership'],
    readMinutes: 7,
    author: AUTHOR,
    coverAlt: 'A smiling professional woman in a grey blazer in an office',
    publishedAt: '2026-10-27T11:00:00',
    excerpt:
      'How to build a personal brand on LinkedIn in 7 steps: positioning, profile, content and consistency, so the right people know what you do and come to you.',
    content: `
<p>Building a personal brand on LinkedIn is not about becoming an influencer. It is about making sure that when the right people think of your area of expertise, they think of you — and know how to reach you.</p>

<p>Here is how to build a personal brand on LinkedIn in seven steps, whether you are employed, self-employed or somewhere in between.</p>

<h2>What is a personal brand on LinkedIn?</h2>

<p>Your personal brand is what people say about you when you are not in the room — and on LinkedIn, it is what they conclude after thirty seconds on your profile and a few of your posts. You already have one. The only question is whether it is deliberate.</p>

<p>A strong personal brand answers three things clearly: what you know, who you help, and why you are worth listening to.</p>

<h2>How do I build a personal brand on LinkedIn?</h2>

<p><strong>1. Choose what you want to be known for.</strong> One area, specific enough to remember. "Finance leader" is broad. "Helping physician-owned practices understand their numbers" is a brand.</p>

<p><strong>2. Define your audience.</strong> Who should think of you? Peers, clients, investors, future employers? Your content, profile and connections should all point at them.</p>

<p><strong>3. Rewrite your profile around that audience.</strong> Start with <a href="/blogs/linkedin-headline-that-gets-you-found">your headline</a>, then <a href="/blogs/linkedin-about-section-people-actually-read">your About section</a>, photo and banner. Your profile is the page every post sends people to.</p>

<p><strong>4. Pick three content pillars.</strong> Three topics you will keep returning to — usually your expertise, your perspective on your industry, and the human side of your work. They make your brand recognisable.</p>

<p><strong>5. Post consistently.</strong> Two or three posts a week, for months. A personal brand is built by repetition: people need to see you talk about the same things before they associate you with them. Use <a href="/blogs/what-to-post-on-linkedin-five-post-types">these five post types</a> to keep it varied.</p>

<p><strong>6. Engage where your audience already is.</strong> Comment on posts from people in your field. Thoughtful comments are one of the fastest ways to be noticed by people who do not follow you yet.</p>

<p><strong>7. Show proof.</strong> Results, client stories, lessons learned, recommendations and Featured items. Proof is what turns "they post a lot" into "they know what they are talking about".</p>

<h2>Personal brand checklist for your LinkedIn profile</h2>

<table>
  <thead>
    <tr><th>Profile section</th><th>What it should do</th><th>Quick test</th></tr>
  </thead>
  <tbody>
    <tr><td>Photo</td><td>Look approachable and current</td><td>Would a client recognise you on a video call?</td></tr>
    <tr><td>Banner</td><td>Reinforce what you do</td><td>Does it say something about your expertise?</td></tr>
    <tr><td>Headline</td><td>Say who you help and how</td><td>Could a stranger repeat it back to you?</td></tr>
    <tr><td>About</td><td>Describe the problem you solve and invite contact</td><td>Does it end with a clear next step?</td></tr>
    <tr><td>Featured</td><td>Show your best proof</td><td>Is your strongest work one click away?</td></tr>
    <tr><td>Experience</td><td>Show results, not just duties</td><td>Does each role include an outcome?</td></tr>
    <tr><td>Recommendations</td><td>Let others vouch for you</td><td>Do you have at least three recent ones?</td></tr>
  </tbody>
</table>

<p>LinkedIn's own guide to <a href="https://www.linkedin.com/help/linkedin/answer/a554351" ${EXT}>creating a good LinkedIn profile</a> is a useful reference for each section.</p>

<p>Dr. Nkem explains why your profile has to do more than look professional:</p>

${video('KeXptv1zyIk', 'Your LinkedIn Profile Should Do More Than Look Good')}

<h2>How do I build a personal brand if I hate self-promotion?</h2>

<p>Teach instead of promote. Share what you have learned, the mistakes you see, and how you think about problems in your field. That is generous rather than boastful, and it does the same job. We wrote a full guide to <a href="/blogs/personal-branding-when-you-hate-self-promotion">personal branding for people who hate self-promotion</a>.</p>

<h2>How long does it take to build a personal brand on LinkedIn?</h2>

<p>Expect early signs — more profile views, comments from people you do not know, a few relevant connection requests — within six to eight weeks of consistent posting. Being known for something takes six to twelve months. The professionals who get there are rarely the most talented. They are the ones who kept showing up.</p>

<h2>Frequently asked questions</h2>

<h3>Do I need a personal brand if I am employed?</h3>
<p>Yes. A clear professional reputation makes it easier to get promoted, change roles, find partners and be invited to speak — inside and outside your current employer.</p>

<h3>Should my personal brand be about my job or about me?</h3>
<p>Both. Lead with your expertise, and let your personality, values and story come through in how you talk about it. People connect with people, not job titles.</p>

<h3>How often should I post to build a personal brand on LinkedIn?</h3>
<p>Two to three times a week is enough for most professionals. What matters most is posting on the same few topics for months, so people start to associate you with them.</p>

<h3>Can I build a personal brand on LinkedIn without posting?</h3>
<p>Partly. A strong profile and regular, thoughtful comments will raise your visibility. But posting is what lets people see how you think, and that is what makes a brand memorable.</p>

<h2>Start this week</h2>

<p>Write one sentence: "I help [audience] with [problem]." Put a version of it in your headline today. Then choose your three content pillars and plan your next three posts around them. For a guided version of all seven steps — with templates and weekly feedback — join <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a>, or build alongside other professionals in <a href="/community">the Circle</a>.</p>
`.trim(),
  },

  // ── Wealth cluster ────────────────────────────────────────────────────────
  {
    slug: 'how-to-build-wealth-on-a-high-salary',
    title: 'How to Build Wealth on a High Salary: 7 Steps',
    category: 'Investing',
    tags: ['build wealth on a high salary', 'high income earners', 'savings rate', 'financial independence'],
    readMinutes: 7,
    author: AUTHOR,
    coverAlt: 'A green seedling growing out of a pile of coins',
    publishedAt: '2026-10-27T12:00:00',
    excerpt:
      'How to build wealth on a high salary in 7 steps: know your spending, automate investing, use tax-advantaged accounts and stop lifestyle creep.',
    content: `
<p>A high salary is the best head start there is for building wealth — and one of the easiest to waste. Many high earners reach their forties with a big income, a big mortgage and very little they actually own.</p>

<p>This guide covers how to build wealth on a high salary in seven practical steps. If you want the reasons the money disappears in the first place, start with <a href="/blogs/high-income-but-no-wealth">high income but no wealth: where the money actually goes</a>.</p>

<h2>Why don't high earners build more wealth?</h2>

<p>Because income and wealth are different things. Income is what you are paid for your time. Wealth is what you own that keeps paying you when you stop. A high salary only becomes wealth when part of it is deliberately converted into assets, every month, for years.</p>

<p>The usual obstacles are lifestyle creep (spending rises with every raise), postponing investing until you "have time to learn it properly", and never looking at tax and structure.</p>

<h2>How do I build wealth on a high salary?</h2>

<p><strong>1. Know your real spending number.</strong> Not your budget — what you actually spent in the last twelve months. This number, not your salary, sets how much you need to be financially independent.</p>

<p><strong>2. Clear high-interest debt first.</strong> Credit card and other high-rate debt is a guaranteed loss that no investment reliably beats.</p>

<p><strong>3. Build a cash buffer.</strong> Three to six months of spending, so you are never forced to sell investments at a bad time.</p>

<p><strong>4. Use tax-advantaged accounts fully.</strong> In the US, that starts with your workplace retirement plan — the IRS publishes the current <a href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits" ${EXT}>401(k) contribution limits</a>. Other countries have their own equivalents. Use them before investing elsewhere.</p>

<p><strong>5. Automate investing on payday.</strong> Set a fixed percentage to move into investments the day you are paid. Money that never reaches your current account does not have to survive a monthly decision.</p>

<p><strong>6. Keep it simple and diversified.</strong> A low-cost, broad <a href="https://www.investor.gov/introduction-investing/investing-basics/glossary/index-fund" ${EXT}>index fund</a> is a sound core for most people. You can add property or a business later; the habit of owning matters more than the perfect choice.</p>

<p><strong>7. Bank every raise.</strong> When your income goes up, raise your investing percentage before your spending catches up. This one habit separates high earners who build wealth from those who do not.</p>

<h2>How much of a high salary should I save?</h2>

<p>The percentage you save — your savings rate — matters far more than the size of your salary. The table below shows roughly how long it takes to reach financial independence (investments worth 25 times your annual spending) from a standing start, assuming a 5% return after inflation.</p>

<table>
  <thead>
    <tr><th>Savings rate</th><th>Years to financial independence</th></tr>
  </thead>
  <tbody>
    <tr><td>10%</td><td>About 52 years</td></tr>
    <tr><td>20%</td><td>About 37 years</td></tr>
    <tr><td>30%</td><td>About 28 years</td></tr>
    <tr><td>40%</td><td>About 22 years</td></tr>
    <tr><td>50%</td><td>About 17 years</td></tr>
    <tr><td>60%</td><td>About 13 years</td></tr>
  </tbody>
</table>

<p>These are illustrations, not promises: real returns vary. But the shape is reliable — and on a high salary, a 30–50% savings rate is achievable in a way it is not on an average income. Run your own numbers with the SEC's <a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" ${EXT}>compound interest calculator</a>.</p>

<h2>How do I stop lifestyle creep?</h2>

<p>Decide in advance. Before your next raise arrives, decide what share goes to investments and what share you will enjoy. Then automate the investing part on the day the raise starts. Upgrades you choose deliberately feel good; upgrades that just happen quietly move your finish line further away.</p>

<h2>Should I invest in property or a business as well?</h2>

<p>Often, yes — once the basics above are in place. Owning income-producing assets beyond the stock market is how many high earners build wealth faster, but it comes with more work and more risk. Dr. Nkem talks about the difference between owning a business and owning a job here:</p>

${video('Bzg0g5mjG1Q', 'The Difference Between Building a Business and Owning a Job')}

<p>If you are weighing up a side business, read <a href="/blogs/how-to-start-a-business-while-working-full-time">how to start a business while working full time</a>. If you are a physician, see <a href="/blogs/passive-income-for-doctors">passive income for doctors: 6 options compared</a>.</p>

<h2>Frequently asked questions</h2>

<h3>What counts as a high salary?</h3>
<p>There is no fixed number. For building wealth, what matters is the gap between what you earn and what you spend — a large gap is what makes a high savings rate possible.</p>

<h3>Is it too late to build wealth in my 40s or 50s?</h3>
<p>No. A high income lets you invest larger amounts, which makes up for some lost time. Start with a high savings rate and use every tax-advantaged account available.</p>

<h3>Should I pay off my mortgage or invest?</h3>
<p>Compare your mortgage rate with a realistic long-term investment return, then weigh how much the debt worries you. Both can be reasonable choices; the costly option is doing neither while you decide.</p>

<h3>Do I need a financial advisor?</h3>
<p>If your situation involves equity compensation, a business, property or cross-border tax, professional advice usually pays for itself. Ask first how the advisor is paid. This article is general information, not financial advice.</p>

<h2>Start this month</h2>

<p>Work out your real spending number, then set up one automatic transfer into investments on your next payday — even a small one. Plain-language conversations about investing and ownership, without sales pitches, are part of what happens in <a href="/community">the Circle</a>.</p>
`.trim(),
  },

  {
    slug: 'passive-income-for-doctors',
    title: 'Passive Income for Doctors: 6 Options Compared',
    category: 'Investing',
    tags: ['passive income for doctors', 'physician investing', 'real estate for doctors', 'physician side income'],
    readMinutes: 7,
    author: AUTHOR,
    coverAlt: 'A stethoscope beside a laptop on a wooden desk',
    publishedAt: '2026-10-27T13:00:00',
    excerpt:
      'Passive income for doctors: six realistic options compared on capital, time and risk, from index funds to real estate syndications, and where to start.',
    content: `
<p>Passive income for doctors is not about leaving medicine. It is about building income that does not depend on your next shift — so that burnout, an injury or a change in how medicine is paid does not decide your future.</p>

<p>As an ER physician who built a real estate portfolio while still practising, I get asked about this constantly. Here are six realistic passive income options for doctors, compared honestly on capital, time and risk.</p>

<h2>Why do doctors need passive income?</h2>

<p>Physicians start earning later than most professionals, often with significant student debt, and their income stops the moment they stop working. A high salary is a strong foundation, but it is not security on its own. The reasons high earners so often end up with little to show for it are covered in <a href="/blogs/high-income-but-no-wealth">high income but no wealth</a>.</p>

<p>One honest note first: almost no income is fully passive. Every option below takes money, time or both to set up. "Passive" here means income that does not require you to trade hours for it once it is running.</p>

<h2>What are the best passive income options for doctors?</h2>

<p><strong>1. Index funds and ETFs.</strong> The simplest place to start. Broad, low-cost funds give you ownership of thousands of companies with almost no ongoing work. Returns come from long-term market growth and dividends.</p>

<p><strong>2. Dividend investing.</strong> Holding companies or funds that pay regular dividends produces cash flow you can see. It is more concentrated than a broad index fund, so it needs more care.</p>

<p><strong>3. Real estate investment trusts (REITs).</strong> REITs let you own a share of income-producing property without buying a building. Investor.gov explains <a href="https://www.investor.gov/introduction-investing/investing-basics/investment-products/real-estate-investment-trusts-reits" ${EXT}>how REITs work and their risks</a>.</p>

<p><strong>4. Rental property.</strong> Owning property directly gives you more control, tax advantages and the use of leverage — and also tenants, repairs and decisions. With a good property manager it becomes much more passive.</p>

<p><strong>5. Real estate syndications.</strong> A group of investors pools money with an experienced operator to buy larger property, such as apartment buildings. You invest capital; the operator runs the property. They are usually limited to accredited investors, are illiquid for several years, and depend entirely on the operator you choose.</p>

<p><strong>6. Owning a stake in a business.</strong> Investing in, or building, a business that runs without you — a practice, a medical-adjacent service or an unrelated company. The potential is highest; so is the work and risk at the start.</p>

<h2>Passive income options for doctors compared</h2>

<table>
  <thead>
    <tr><th>Option</th><th>Starting capital</th><th>Your time</th><th>Liquidity</th><th>Main risk</th></tr>
  </thead>
  <tbody>
    <tr><td>Index funds and ETFs</td><td>Low</td><td>Very low</td><td>High</td><td>Market swings</td></tr>
    <tr><td>Dividend investing</td><td>Low to medium</td><td>Low</td><td>High</td><td>Concentration in fewer companies</td></tr>
    <tr><td>REITs</td><td>Low</td><td>Very low</td><td>High (if publicly traded)</td><td>Property market and interest rates</td></tr>
    <tr><td>Rental property</td><td>Medium to high</td><td>Medium (low with a manager)</td><td>Low</td><td>Vacancies, repairs, leverage</td></tr>
    <tr><td>Real estate syndications</td><td>High</td><td>Low after due diligence</td><td>Low (several years)</td><td>Choosing the wrong operator</td></tr>
    <tr><td>Business ownership</td><td>Varies</td><td>High at first</td><td>Low</td><td>Execution and market</td></tr>
  </tbody>
</table>

<p>In my own journey, real estate became the main engine — here is how I built $153M in real estate while still practising medicine:</p>

${video('o4AQ_caRffg', '$153M in Real Estate While Still Practicing Medicine: How Did I Do It?')}

<h2>Where should a doctor start with passive income?</h2>

<p>Start with the foundation, then add complexity. First, know your spending and clear high-interest debt. Then automate investing into tax-advantaged accounts and broad index funds — the steps in <a href="/blogs/how-to-build-wealth-on-a-high-salary">how to build wealth on a high salary</a>. Only after that add real estate or business ownership, one at a time, and learn each one properly before you invest heavily.</p>

<p>If you have income from a side business or consulting, the IRS <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center" ${EXT}>self-employed tax center</a> explains your obligations. For anything involving business structure or real estate, an accountant who works with physicians is worth the fee.</p>

<h2>Frequently asked questions</h2>

<h3>What is the easiest passive income for doctors?</h3>
<p>Low-cost index funds. They need little capital, almost no time and no specialist knowledge, which makes them the right first step for most physicians.</p>

<h3>Is real estate good passive income for physicians?</h3>
<p>It can be, especially through syndications or professionally managed rentals, because a physician's income makes it easier to invest and to qualify for financing. It is only as passive as the people managing it, so due diligence on operators and managers matters most.</p>

<h3>How much money do I need to start earning passive income?</h3>
<p>Very little to begin with index funds or REITs. Direct property and syndications usually need tens of thousands of dollars or more, and syndications are often limited to accredited investors.</p>

<h3>Can I build passive income while still practising full time?</h3>
<p>Yes. Most physicians who succeed do exactly that — investing a high percentage of their income consistently, and choosing options that do not need daily attention. This article is general information, not financial advice.</p>

<h2>Your next step</h2>

<p>Pick one option from the table that fits your time and capital today, and learn it properly before investing heavily. If you want to talk it through with other physicians and professionals doing the same, join us in <a href="/community">the Circle</a>. And if you are thinking about <a href="/blogs/how-to-start-a-business-while-working-full-time">starting a business alongside medicine</a>, start there.</p>
`.trim(),
  },
]
