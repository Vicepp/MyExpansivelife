/**
 * Keyword-first guides (October 2026).
 *
 * Written to the Google-reach brief in the blog-post skill: the title is the
 * phrase people type, every guide has a "Frequently asked questions"
 * section, plus a table and a My Expansive Life video where they genuinely help (which src/lib/faq.js turns
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

<h2>What stops most people getting clients on LinkedIn?</h2>

<p>When this does not work, it is almost always one of five mistakes:</p>

<ol>
  <li><strong>A profile written for recruiters.</strong> A headline that only states a job title tells potential clients nothing about what you could do for them.</li>
  <li><strong>Posting about yourself instead of their problems.</strong> Announcements and achievements get polite likes. Clear thinking about a client's problem gets enquiries.</li>
  <li><strong>Pitching in the first message.</strong> It ends conversations before they begin, and it is the fastest way to be ignored.</li>
  <li><strong>Giving up after a month.</strong> Trust builds over repeated exposure. Most people stop just before the first enquiries would have arrived.</li>
  <li><strong>No follow-up system.</strong> Warm conversations go cold because nobody wrote down what was said or what came next.</li>
</ol>

<p>Fix the first two before you do anything else. A clear profile and useful posts make every other step easier, because people arrive already knowing what you do.</p>

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

<h2>What does a strong personal brand on LinkedIn look like?</h2>

<p>Three short sketches of what "deliberate" looks like in practice:</p>

<p><strong>The specialist.</strong> A finance director who writes twice a week about cash flow in growing service businesses. Her headline names who she helps, her Featured section holds a short guide, and founders now message her before they hire a CFO.</p>

<p><strong>The translator.</strong> A physician who explains healthcare decisions in plain language for patients and employers. He posts the questions he hears most often in clinic. Within a year he is being invited to speak at conferences.</p>

<p><strong>The builder.</strong> An engineer who documents the side business she is building alongside her job — what worked, what did not, what it cost. Her honesty is the brand, and it attracts collaborators and early customers.</p>

<p>None of them are famous. Each is clearly known for one thing, by the right people.</p>

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

<h2>What does this look like in practice?</h2>

<p>Take a professional earning $250,000 a year who spends $180,000 of it — a savings rate of about 28%. Following the steps above, they:</p>

<ul>
  <li>Hold their spending steady for three years while their income rises by 4% a year.</li>
  <li>Direct each raise straight into investments the month it starts.</li>
  <li>Fill their tax-advantaged retirement accounts before investing anywhere else.</li>
</ul>

<p>Within three years, their savings rate moves from roughly 28% to well over 30% without any cut in their standard of living. On the table above, that difference alone takes years off the time to financial independence. Nothing dramatic changed. They simply stopped letting each raise disappear into a bigger lifestyle.</p>

<p>The figures are illustrative, but the mechanism is reliable: wealth on a high salary is built by the gap between income and spending, widened a little every year.</p>

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

<h2>What mistakes do physicians make with passive income?</h2>

<ol>
  <li><strong>Skipping the foundation.</strong> Buying a rental property while carrying high-interest debt and no cash buffer turns one bad month into a crisis.</li>
  <li><strong>Trusting the pitch instead of the operator.</strong> Physicians are targeted by aggressive sellers. In any private deal, the track record and honesty of the person running it matter more than the projected returns.</li>
  <li><strong>Mistaking "passive" for "no attention".</strong> Even well-managed investments need periodic review. Set a quarterly hour to look at everything you own.</li>
  <li><strong>Concentrating too much.</strong> Putting most of your savings into one property, one deal or one company makes your future depend on a single outcome.</li>
  <li><strong>Waiting for the perfect moment.</strong> There is always a reason to wait. Consistent investing over years matters far more than timing.</li>
</ol>

<h2>How much time does passive income take for a busy physician?</h2>

<p>Less than most physicians expect once it is set up, and more than the marketing suggests while it is being set up. Index funds take an afternoon to start and an hour a quarter to review. Property and private deals take weeks of learning and due diligence before the first investment, then a few hours a month. Plan the learning time honestly, and start with the options that fit the schedule you actually have — not the one you hope to have after your next rota changes.</p>

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

  // ── Second batch: one per category, a different format each ─────────────
  {
    slug: 'what-is-a-portfolio-career',
    title: "What Is a Portfolio Career? (And Who It's For)",
    category: 'Career',
    tags: ['portfolio career', 'multiple income streams', 'career change', 'side business'],
    readMinutes: 6,
    author: AUTHOR,
    coverAlt: 'A smiling man working on a laptop and phone in a bright café',
    publishedAt: '2026-10-27T14:00:00',
    excerpt:
      'What is a portfolio career? The meaning, real examples, the pros and cons, and how to tell whether combining several kinds of work suits you.',
    content: `
<p>A portfolio career is a working life built from several streams of work at once, instead of a single full-time job. A doctor who also invests in property and teaches. A marketing director who consults two days a week and runs a small product business. An engineer who writes, advises start-ups and still holds a part-time role.</p>

<p>It is not the same as having a side hustle. In a portfolio career, each stream is a deliberate part of how you earn, learn and spend your time — and together they add up to more than any one of them could.</p>

<h2>What does a portfolio career look like in practice?</h2>

<p>Most portfolio careers combine one stable anchor with two or three other streams that grow over time. A few common shapes:</p>

<table>
  <thead>
    <tr><th>Anchor</th><th>Added streams</th><th>Why it works</th></tr>
  </thead>
  <tbody>
    <tr><td>Part-time clinical role</td><td>Real estate investing, medical advisory work</td><td>Steady income while assets build in the background</td></tr>
    <tr><td>Senior employed role (3–4 days)</td><td>Consulting, a non-executive board seat</td><td>Expertise is sold to more than one organisation</td></tr>
    <tr><td>Freelance or consulting practice</td><td>A course, speaking, a small product</td><td>Income that is not tied to billable hours</td></tr>
    <tr><td>Business owner</td><td>Angel investing, writing, mentoring</td><td>Experience turns into reputation and ownership</td></tr>
  </tbody>
</table>

<p>Notice that most of these keep one familiar source of income. Very few successful portfolio careers start by quitting everything at once.</p>

<h2>What are the benefits of a portfolio career?</h2>

<ul>
  <li><strong>Resilience.</strong> If one stream slows down, the others keep going. A single job is a single point of failure.</li>
  <li><strong>Room to grow.</strong> You can use skills your main role never touches, and develop new ones without starting over.</li>
  <li><strong>Ownership.</strong> Adding assets — a business, property, intellectual property — builds wealth that a salary alone does not.</li>
  <li><strong>Control.</strong> You decide where your time goes, which makes it easier to say no to work that does not fit.</li>
</ul>

<h2>What are the downsides?</h2>

<ul>
  <li><strong>Income can be uneven</strong>, especially in the first year or two.</li>
  <li><strong>Admin multiplies.</strong> More invoices, more tax paperwork, more calendars. If you have self-employment income in the US, the IRS <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center" ${EXT}>self-employed tax center</a> explains what changes.</li>
  <li><strong>Context switching is tiring.</strong> Moving between very different kinds of work every day takes energy.</li>
  <li><strong>Explaining what you do gets harder</strong> — which is why a clear personal brand matters more, not less.</li>
</ul>

<h2>Is a portfolio career right for you?</h2>

<p>It tends to suit people who:</p>

<ol>
  <li>Are good at their main work and want more than one way to use it.</li>
  <li>Feel restless rather than burned out — they want more variety, not less work. (If you are not sure which it is, read <a href="/blogs/burnout-or-boredom">burnout or boredom: how to tell the difference</a>.)</li>
  <li>Can live with some uncertainty while new streams grow.</li>
  <li>Have, or can build, a financial buffer of several months.</li>
</ol>

<p>It is a poor fit if you need complete income certainty right now, or if your main job already uses all of your energy.</p>

<h2>How do you start a portfolio career?</h2>

<p>Start small and keep your anchor. Choose one additional stream that uses what you already know, give it a fixed few hours a week, and run it for six months before adding anything else. Our guide to <a href="/blogs/how-to-start-a-business-while-working-full-time">starting a business while working full time</a> walks through the first steps, and <a href="/blogs/what-comes-next-when-your-career-is-already-going-well">what comes next when your career is already going well</a> is a good place to start if you are still deciding.</p>

<p>Dr. Nkem talks about building a life that is bigger than one career here:</p>

${video('lChC8eWuMY0', 'Beyond Career Success: Building a More Fulfilling Life')}

<h2>What do portfolio careers look like in real life?</h2>

<p><strong>A physician turned investor.</strong> She keeps clinical shifts as her anchor, invests in real estate through partnerships, and teaches other physicians about money. Her clinical income pays the bills; her investments build long-term security; teaching builds her reputation.</p>

<p><strong>A consultant with a product.</strong> He consults three days a week, writes a newsletter for his niche, and sells a small online course built from the questions clients ask most. The consulting funds the other two; the course and newsletter mean his income is no longer tied entirely to hours.</p>

<p>In both cases, the streams support each other. That is the difference between a portfolio career and simply having several jobs.</p>

<h2>How do you explain a portfolio career to other people?</h2>

<p>Lead with the thread that connects your work, not a list of roles. "I help physicians build wealth — through my own investing, through teaching, and through my clinical work" is clear and memorable. "I'm a doctor, an investor and a teacher" sounds scattered.</p>

<p>The same applies to your LinkedIn profile: one headline that names the common thread, then the individual streams in your About section and Experience.</p>

<h2>How do you manage your time across several streams?</h2>

<ul>
  <li><strong>Give each stream fixed blocks.</strong> Specific days or half-days work better than fitting everything around everything else.</li>
  <li><strong>Batch similar work.</strong> Do all writing, calls or admin together, so you are not switching between very different kinds of thinking every hour.</li>
  <li><strong>Review quarterly.</strong> Look at what each stream earned and what it cost you in time and energy, then decide what to grow, keep or drop.</li>
</ul>

<h2>Frequently asked questions</h2>

<h3>Is a portfolio career the same as a side hustle?</h3>
<p>Not quite. A side hustle is usually extra income on top of a job. A portfolio career treats every stream as a planned part of your working life, often with the aim of reducing dependence on any single employer.</p>

<h3>How much can you earn with a portfolio career?</h3>
<p>It varies widely. Many people earn less in the first year while new streams grow, then more than a single salary once those streams mature — especially when one of them is an asset like a business or property.</p>

<h3>Do I need to quit my job to start a portfolio career?</h3>
<p>No. Most people build one while still employed, often by reducing hours later rather than leaving outright.</p>

<h3>What skills do you need for a portfolio career?</h3>
<p>Deep expertise in at least one area, plus the basics of managing your own time, money and reputation. A visible professional profile makes every stream easier to grow.</p>

<h2>Where to go next</h2>

<p>If you are building beyond a single career, you do not have to work it out alone. That is exactly what <a href="/community">the Circle</a> is for.</p>
`.trim(),
  },

  {
    slug: 'burnout-or-boredom',
    title: 'Burnout or Boredom? How to Tell the Difference',
    category: 'Mindset',
    tags: ['burnout vs boredom', 'burnout symptoms', 'career boredom', 'work fatigue'],
    readMinutes: 6,
    author: AUTHOR,
    coverAlt: 'A tired man resting his head in his hand in a dark leather armchair',
    publishedAt: '2026-10-27T15:00:00',
    excerpt:
      'Burnout or boredom? They feel alike but need opposite fixes. Compare the signs side by side and work out which one you are actually dealing with.',
    content: `
<p>Burnout and boredom can feel surprisingly similar. In both, you dread Monday, your motivation drops and work you used to enjoy feels flat. But they come from opposite problems — and the fix for one makes the other worse.</p>

<p>Burnout usually means you are giving more than you have. Boredom usually means you are giving less than you could. Here is how to tell which one you are dealing with.</p>

<h2>What is burnout?</h2>

<p>The World Health Organization describes <a href="https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon" ${EXT}>burn-out as an occupational phenomenon</a> resulting from chronic workplace stress that has not been successfully managed. It has three parts: exhaustion, growing distance or cynicism about your job, and a sense that you are no longer effective.</p>

<h2>What is career boredom?</h2>

<p>Boredom at work is the opposite pressure. You are not overwhelmed — you are under-used. The work no longer stretches you, you could do it half-asleep, and you have stopped learning. It often hits capable people a few years into a role they have mastered.</p>

<h2>Burnout vs boredom: the signs side by side</h2>

<table>
  <thead>
    <tr><th>Sign</th><th>Burnout</th><th>Boredom</th></tr>
  </thead>
  <tbody>
    <tr><td>Energy</td><td>Drained, even after rest</td><td>Restless, energy with nowhere to go</td></tr>
    <tr><td>Workload</td><td>Too much, for too long</td><td>Too little challenge, often too easy</td></tr>
    <tr><td>A free weekend</td><td>Spent recovering</td><td>Spent on projects you enjoy far more than work</td></tr>
    <tr><td>Feeling about the job</td><td>Cynical, detached, overwhelmed</td><td>Flat, uninterested, under-used</td></tr>
    <tr><td>Thinking about something new</td><td>Feels like more weight</td><td>Feels exciting</td></tr>
    <tr><td>Sleep and health</td><td>Often affected</td><td>Usually unaffected</td></tr>
    <tr><td>What helps</td><td>Less load, recovery, support</td><td>More challenge, learning, new work</td></tr>
  </tbody>
</table>

<h2>Three questions to tell them apart</h2>

<p><strong>1. If your workload halved tomorrow, would you feel relief or emptiness?</strong> Relief points to burnout. Emptiness points to boredom.</p>

<p><strong>2. Does a new challenge sound exciting or exhausting?</strong> Exciting suggests boredom; exhausting suggests burnout.</p>

<p><strong>3. Do you recover over a holiday?</strong> If two weeks off restores you and the feeling returns within days of going back, the job itself is the problem. If you never quite recover, look at load and stress first.</p>

<p>You can have both at once — exhausted by a heavy workload made of work that no longer interests you. That combination is common in senior roles, and it is worth naming honestly.</p>

<p>Dr. Nkem on why exhaustion should never be worn as a badge of honour:</p>

${video('5n_exxnd8XI', 'Burnout Is Not a Badge')}

<h2>What should you do about each?</h2>

<p><strong>If it is burnout,</strong> reduce load before you add anything. Talk to your manager about scope, protect recovery time, and get support. Our guide to <a href="/blogs/how-to-stay-ambitious-without-burning-out">staying ambitious without burning out</a> covers how to keep your goals without paying for them with your health. If you have symptoms such as persistent low mood, sleep problems or anxiety, speak to a doctor — burnout can overlap with depression, and both are treatable.</p>

<p><strong>If it is boredom,</strong> add challenge. Ask for a stretch project, learn something adjacent to your work, or start building something of your own. For many people, boredom is the first signal that it is time for <a href="/blogs/what-comes-next-when-your-career-is-already-going-well">what comes next</a> — sometimes <a href="/blogs/what-is-a-portfolio-career">a portfolio career</a>.</p>

<h2>What causes burnout and boredom at work?</h2>

<p><strong>Burnout usually comes from sustained imbalance:</strong> heavy workloads, little control over how the work is done, unclear expectations, too little recognition or support, and values that clash with the job. Effort keeps going out; recovery and reward do not come back in.</p>

<p><strong>Boredom usually comes from mastery without growth:</strong> work you can do on autopilot, no new problems to solve, no path to the next level, or a role that no longer matches what you care about. It is common in people who have been very good at the same job for several years.</p>

<p>Knowing the cause matters because it points to the fix. Burnout caused by workload needs less load. Burnout caused by lack of control needs more say in how you work. Boredom caused by mastery needs a genuine new challenge, not just more of the same tasks.</p>

<h2>How do you talk to your manager about it?</h2>

<p>Describe the situation, not the label. Instead of "I'm burned out", try "My workload over the last three months has been more than I can sustain, and the quality of my work is starting to suffer." Instead of "I'm bored", try "I've mastered this role and I'd like to take on something that stretches me."</p>

<p>Then come with a proposal: what you would stop, delegate or postpone, or what new responsibility you would like. Managers respond far better to a specific request than to a general complaint.</p>

<h2>Can a change of role fix both?</h2>

<p>Sometimes, but not automatically. A new role with the same workload and the same lack of control will bring the same burnout to a new desk. A new role that is simply a bigger version of work you have already mastered may cure boredom for six months and then return it. Before changing jobs, be clear about which problem you are solving — then check that the new role actually changes that thing.</p>

<h2>Frequently asked questions</h2>

<h3>Can boredom turn into burnout?</h3>
<p>Yes. Long periods of meaningless or under-challenging work can wear people down, a pattern sometimes called "boreout". Working harder at work you do not care about rarely fixes it.</p>

<h3>How long does it take to recover from burnout?</h3>
<p>It depends on how severe it is and whether the causes change. Mild burnout can ease in weeks with reduced load; more severe burnout can take months and often needs professional support.</p>

<h3>Should I quit my job if I am bored?</h3>
<p>Not necessarily. Try to add challenge inside the role first. If nothing changes after a few months, that is useful information about what you need next.</p>

<h3>When should I see a doctor about burnout?</h3>
<p>If exhaustion, low mood, poor sleep or anxiety last for weeks or affect your daily life, see a doctor. If you ever feel unsafe or think about harming yourself, contact emergency services or, in the US, call or text 988 to reach the <a href="https://988lifeline.org/" ${EXT}>988 Suicide &amp; Crisis Lifeline</a>. This article is general information, not medical advice.</p>

<h2>Name it, then act on it</h2>

<p>Knowing which one you are facing is most of the work, because it tells you whether to subtract or to add. If you want people around you who are working through the same question, that is part of what happens in <a href="/community">the Circle</a>.</p>
`.trim(),
  },

  {
    slug: 'are-mastermind-groups-worth-it',
    title: 'Mastermind Groups: Are They Worth It for Professionals?',
    category: 'Community',
    tags: ['mastermind groups', 'peer advisory group', 'professional community', 'accountability group'],
    readMinutes: 6,
    author: AUTHOR,
    coverAlt: 'A group of professionals around a conference table listening to a speaker',
    publishedAt: '2026-10-27T16:00:00',
    excerpt:
      'Are mastermind groups worth it? An honest look at the benefits, costs and red flags, and how to choose the right group for your stage of career.',
    content: `
<p>A mastermind group is a small group of peers who meet regularly to help each other with goals, decisions and problems. The idea is simple: several experienced minds working on your challenge are better than one — and having to report back to people you respect keeps you moving.</p>

<p>But masterminds range from free peer groups to programmes costing thousands of dollars, and quality varies just as widely. Here is an honest answer to whether they are worth it.</p>

<h2>What happens in a mastermind group?</h2>

<p>Most follow a similar pattern. A group of five to twelve people meets weekly or monthly. Each member shares progress and a current challenge, and the group asks questions and offers ideas. Many groups give one member a longer "hot seat" each meeting to go deep on a single problem. Between meetings, members follow through on what they committed to.</p>

<h2>What are the benefits of a mastermind group?</h2>

<ul>
  <li><strong>Accountability.</strong> Saying out loud what you will do by next session, to people who will ask, is one of the most reliable ways to actually do it.</li>
  <li><strong>Better decisions.</strong> Peers spot blind spots that you cannot see from inside your own situation.</li>
  <li><strong>A network that grows with you.</strong> Members often become collaborators, clients and lifelong contacts. It is one of the most effective ways of <a href="/blogs/how-to-build-a-professional-network-mid-career">building a professional network mid-career</a>.</li>
  <li><strong>Perspective.</strong> Hearing how others handle similar problems makes your own feel less isolating.</li>
</ul>

<h2>What are the downsides?</h2>

<ul>
  <li><strong>Cost.</strong> Paid masterminds can be expensive, and price does not guarantee quality.</li>
  <li><strong>Mismatch.</strong> A group at a very different stage from you can waste everyone's time.</li>
  <li><strong>Time.</strong> Regular meetings and follow-through are a real commitment.</li>
  <li><strong>Weak facilitation.</strong> Without a good facilitator, sessions drift into small talk or one person dominates.</li>
</ul>

<h2>Mastermind vs other options: which do you need?</h2>

<table>
  <thead>
    <tr><th>Option</th><th>Typical cost</th><th>Best for</th></tr>
  </thead>
  <tbody>
    <tr><td>Free peer mastermind</td><td>Free</td><td>Accountability with people you already trust</td></tr>
    <tr><td>Paid facilitated mastermind</td><td>Hundreds to thousands per year</td><td>Senior professionals who want a curated, high-level peer group</td></tr>
    <tr><td>Membership community</td><td>Monthly fee</td><td>Ongoing learning, events and a wider network</td></tr>
    <tr><td>One-to-one coaching</td><td>Highest per hour</td><td>Focused help on a specific goal or transition</td></tr>
  </tbody>
</table>

<h2>Red flags to watch for</h2>

<ol>
  <li>Promises of guaranteed income or results.</li>
  <li>No clear criteria for who can join, so stages and goals are all over the place.</li>
  <li>The organiser sells to members more than members help each other.</li>
  <li>No way to speak with current or past members before you pay.</li>
  <li>High-pressure, "only today" pricing.</li>
</ol>

<h2>So, are mastermind groups worth it?</h2>

<p>They are worth it when three things are true: the members are at a similar stage with similar ambitions, the group is well facilitated, and you show up consistently and do the work between sessions. Without those, even an expensive group will disappoint. With them, a mastermind can be the most valuable hour of your month. For more on how strong professionals manage themselves and their growth, <a href="https://hbr.org/topic/subject/managing-yourself" ${EXT}>Harvard Business Review's "managing yourself" collection</a> is worth browsing.</p>

<h2>What does a good mastermind group look like?</h2>

<ul>
  <li><strong>Members at a similar stage.</strong> Roughly the same level of experience and ambition, so everyone can contribute as well as learn.</li>
  <li><strong>A clear format.</strong> Every meeting follows the same structure — check-ins, a hot seat, commitments — so time is not wasted.</li>
  <li><strong>A skilled facilitator.</strong> Someone who keeps time, draws out quieter members and stops any one person dominating.</li>
  <li><strong>Confidentiality.</strong> Members can share real numbers and real problems without worrying where they will end up.</li>
  <li><strong>A defined commitment.</strong> A fixed term, such as six or twelve months, with an expectation that you attend.</li>
</ul>

<h2>How do you get the most out of a mastermind?</h2>

<ol>
  <li><strong>Bring a real problem every time.</strong> The value comes from working on decisions that matter, not updates that do not.</li>
  <li><strong>Make specific commitments.</strong> "Send three proposals by Friday" is useful. "Work on sales" is not.</li>
  <li><strong>Give as much as you take.</strong> Your questions and ideas for others are what earn you the group's best thinking in return.</li>
  <li><strong>Be honest about what did not happen.</strong> The group can only help with what you share.</li>
  <li><strong>Stay for the full term.</strong> Trust takes a few months to build, and the best sessions usually come after it does.</li>
</ol>

<h2>Questions to ask before you join</h2>

<ol>
  <li>Who are the current members, and what stage are they at?</li>
  <li>How are members selected, and who decides?</li>
  <li>What does a typical session look like, and who facilitates it?</li>
  <li>What is the minimum commitment, and what happens if you need to leave?</li>
  <li>Can you speak to one or two current or former members first?</li>
  <li>What, specifically, have members achieved in the last year?</li>
</ol>

<p>A good group will answer all of these easily. Vague answers are a warning sign in themselves.</p>

<h2>How does a typical mastermind session run?</h2>

<p>A common 90-minute format: ten minutes of quick wins and check-ins, forty-five minutes of one or two "hot seats" where a member presents a real problem and the group asks questions before offering ideas, twenty minutes of shorter requests for help, and fifteen minutes for everyone to state one specific commitment for the next session. The structure matters more than the length — it is what keeps the time useful.</p>

<h2>Frequently asked questions</h2>

<h3>How much does a mastermind group cost?</h3>
<p>Anything from free to several thousand dollars a year. Peer-run groups are often free; facilitated groups for executives and business owners cost more.</p>

<h3>How many people should be in a mastermind group?</h3>
<p>Usually five to twelve. Fewer limits the range of perspectives; more makes it hard for everyone to get real time each session.</p>

<h3>How often do mastermind groups meet?</h3>
<p>Most meet weekly, every two weeks or monthly, for 60 to 120 minutes. Regularity matters more than frequency.</p>

<h3>Can I start my own mastermind group?</h3>
<p>Yes. Invite four to six peers at a similar stage, agree on a format and a meeting rhythm, and rotate facilitation. Keep it small and commit to it for at least six months.</p>

<h2>Where to start</h2>

<p>If you want accountability, learning and a peer network without organising it yourself, <a href="/community">the Circle</a> combines all three, including the live Monday Momentum sessions.</p>
`.trim(),
  },

  {
    slug: 'linkedin-profile-checklist',
    title: 'LinkedIn Profile Checklist: 15 Things to Fix Today',
    category: 'Personal Branding',
    tags: ['linkedin profile checklist', 'linkedin profile tips', 'optimise linkedin profile', 'linkedin profile'],
    readMinutes: 5,
    author: AUTHOR,
    coverAlt: 'A hand ticking items on a handwritten checklist in a notebook',
    publishedAt: '2026-10-27T17:00:00',
    excerpt:
      'A LinkedIn profile checklist of 15 quick fixes, from photo and headline to Featured and recommendations, so your profile works for you today.',
    content: `
<p>Your LinkedIn profile is the page every post, comment and connection request sends people to. If it is out of date or vague, you lose them there. This LinkedIn profile checklist covers 15 things you can fix today — most take five minutes or less.</p>

<p>Work through it with your profile open in another tab.</p>

<h2>The first impression (items 1–5)</h2>

<ol>
  <li><strong>Profile photo.</strong> Recent, face clearly visible, good light, plain background. You should look like you do on a video call.</li>
  <li><strong>Banner image.</strong> Replace the default blue with something that says what you do — your field, your work or a short line of text.</li>
  <li><strong>Headline.</strong> Say who you help and how, not just your job title. Our guide to <a href="/blogs/linkedin-headline-that-gets-you-found">writing a LinkedIn headline that gets you found</a> has formulas you can use.</li>
  <li><strong>Custom profile URL.</strong> Change it to your name instead of the default string of numbers. LinkedIn explains <a href="https://www.linkedin.com/help/linkedin/answer/a522735" ${EXT}>how to find and edit your public profile URL</a>.</li>
  <li><strong>Location and industry.</strong> Make sure both are accurate — people search by them.</li>
</ol>

<h2>The story (items 6–10)</h2>

<ol start="6">
  <li><strong>About section opening.</strong> The first two lines show before "see more". Lead with the problem you solve, not "I am a passionate…". See <a href="/blogs/linkedin-about-section-people-actually-read">how to write an About section people actually read</a>.</li>
  <li><strong>About section ending.</strong> Finish with a clear next step: how to contact you or what to do next.</li>
  <li><strong>Experience shows results.</strong> For each recent role, add one line on an outcome — a number, a change, a result — not just your duties.</li>
  <li><strong>Featured section.</strong> Pin your best two or three pieces: a strong post, an article, a talk, a client result.</li>
  <li><strong>Skills.</strong> List the skills you want to be found for, with the most important first.</li>
</ol>

<h2>The proof and the basics (items 11–15)</h2>

<ol start="11">
  <li><strong>Recommendations.</strong> Aim for at least three recent ones. Ask former colleagues or clients directly, and suggest what they could mention.</li>
  <li><strong>Contact information.</strong> Add a work email or website so interested people can reach you outside LinkedIn.</li>
  <li><strong>Open to / Services.</strong> If you want opportunities or clients, say so using LinkedIn's own options.</li>
  <li><strong>Remove what no longer fits.</strong> Old roles, outdated skills and irrelevant posts in Featured blur your message.</li>
  <li><strong>Check it as a stranger.</strong> View your profile logged out, or ask someone outside your field: can they say what you do in one sentence?</li>
</ol>

<p>The whole checklist takes about two hours — and you only need to do it properly once, then review it every few months. LinkedIn's own guide to <a href="https://www.linkedin.com/help/linkedin/answer/a554351" ${EXT}>creating a good profile</a> is a useful companion.</p>

<h2>What are the most common LinkedIn profile mistakes?</h2>

<ul>
  <li><strong>A job title as the headline.</strong> It tells people what you are called, not what you do for anyone.</li>
  <li><strong>An About section written like a CV.</strong> Long lists of responsibilities in the third person, with no reason for the reader to get in touch.</li>
  <li><strong>An old or unclear photo.</strong> If people do not recognise you on a video call, your profile has lost some trust before you speak.</li>
  <li><strong>An empty Featured section.</strong> It is the most visible place to show your best work, and most people leave it blank.</li>
  <li><strong>No way to contact you.</strong> Interested people should not have to work out how to reach you.</li>
</ul>

<h2>Before and after: a headline and About opening</h2>

<p><strong>Before:</strong> "Senior Financial Analyst at Northwind Group"</p>

<p><strong>After:</strong> "Financial analyst helping growing healthcare practices understand their numbers | Cash flow · Forecasting · Practice valuation"</p>

<p>The second version tells the right reader who it is for, what problem it solves and which skills to search for — in one line.</p>

<p><strong>About section, before:</strong> "I am a results-driven professional with over ten years of experience in financial analysis."</p>

<p><strong>About section, after:</strong> "Most practice owners know their revenue. Far fewer know which services actually make them money. For ten years I have helped healthcare practices find out — and decide what to do about it."</p>

<p>The second opening starts with the reader's problem and earns the click on "see more".</p>

<h2>How do you ask for a LinkedIn recommendation?</h2>

<p>Ask people who have seen your work directly — a former manager, a colleague you worked closely with, or a client — and make it easy for them. A short personal message works far better than LinkedIn's default request:</p>

<blockquote>"Hi Sarah, I'm updating my LinkedIn profile and would value a short recommendation from you, since we worked together on the clinic expansion. If it helps, you could mention how we handled the budget and timeline. Happy to write one for you too."</blockquote>

<p>Offering to return the favour, and suggesting what they could mention, roughly doubles the chance of a reply. Ask three or four people at once; not everyone will have time.</p>

<h2>What should go in your Featured section?</h2>

<p>Pin two or three items that prove what your headline claims: a post that explains how you think, an article or talk, a case study or client result, or a link to your website or booking page. Put the strongest first — it is the one most people will see without scrolling.</p>

<h2>Frequently asked questions</h2>

<h3>What is the most important part of a LinkedIn profile?</h3>
<p>The headline. It appears next to your name everywhere on LinkedIn — in comments, search results and connection requests — so it shapes most first impressions.</p>

<h3>How often should I update my LinkedIn profile?</h3>
<p>Review it every three months, and update it whenever your role, focus or results change.</p>

<h3>Does a complete LinkedIn profile get more views?</h3>
<p>Complete profiles give LinkedIn and searchers more to match against, so they tend to appear in more searches. More importantly, a clear profile converts the views you already get.</p>

<h3>Should my LinkedIn profile be written in the first person?</h3>
<p>Yes, for the About section. "I help…" reads as more personal and direct than writing about yourself in the third person.</p>

<h2>What to do after the checklist</h2>

<p>A strong profile is the foundation; posting is what brings people to it. Next, read <a href="/blogs/how-to-build-a-personal-brand-on-linkedin">how to build a personal brand on LinkedIn</a>. For the full system, including profile reviews and feedback, join <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a>.</p>
`.trim(),
  },

  {
    slug: 'money-myths-high-earners-believe',
    title: '5 Money Myths High Earners Believe (And the Truth)',
    category: 'Investing',
    tags: ['money myths', 'high earners', 'personal finance mistakes', 'wealth building'],
    readMinutes: 6,
    author: AUTHOR,
    coverAlt: 'United States dollar bills scattered across a surface',
    publishedAt: '2026-10-27T18:00:00',
    excerpt:
      'Five money myths that keep high earners from building wealth, from "my salary is my safety net" to "I will invest once I learn more", and the truth.',
    content: `
<p>High earners are rarely bad with money because they lack intelligence. They are held back by beliefs that sound sensible, get repeated by colleagues and quietly cost them years. Here are five money myths high earners believe — and what is actually true.</p>

<h2>Myth 1: "My salary is my safety net."</h2>

<p><strong>The truth:</strong> a salary is the opposite of a safety net — it stops the moment you do. Illness, burnout, a restructure or a change in your industry can end it with little notice. Real security is what you own: savings, investments and assets that keep working when you cannot. This is the core idea in <a href="/blogs/high-income-but-no-wealth">high income but no wealth</a>.</p>

<h2>Myth 2: "I'll start investing once I have learned more."</h2>

<p><strong>The truth:</strong> waiting is the expensive choice. Professionals used to mastering complex fields often assume investing needs the same depth of study before they begin. It does not. A low-cost, diversified <a href="https://www.investor.gov/introduction-investing/investing-basics/glossary/index-fund" ${EXT}>index fund</a> is a sound start for most people, and every year of delay is a year of compounding you cannot buy back. See for yourself with the SEC's <a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" ${EXT}>compound interest calculator</a>.</p>

<h2>Myth 3: "I'll save more when I earn more."</h2>

<p><strong>The truth:</strong> spending almost always rises to meet income. People who do not save at $150,000 rarely start at $250,000 — the bigger house and the better car arrive first. The fix is to decide your savings rate before the raise lands and automate it, as set out in <a href="/blogs/how-to-build-wealth-on-a-high-salary">how to build wealth on a high salary</a>.</p>

<h2>Myth 4: "Debt is fine because I can afford the payments."</h2>

<p><strong>The truth:</strong> affordable payments still take future income. Large mortgages, car loans and lines of credit lock in high fixed costs, which raise the amount you need to be financially independent and make it harder to change direction. Some debt is useful; debt you carry just because the payment fits is a choice to keep working longer.</p>

<h2>Myth 5: "Passive income is only for people with spare time."</h2>

<p><strong>The truth:</strong> the right options take very little time once they are set up. Index funds, REITs and professionally managed real estate let busy professionals own income-producing assets without a second job. We compare six options in <a href="/blogs/passive-income-for-doctors">passive income for doctors</a> — and the comparison applies to most high earners.</p>

<h2>Where do these money myths come from?</h2>

<p>Most of them come from habits that served high earners well earlier in life. Years of training reward deferring things until you are qualified — so investing gets deferred too. Professional cultures often treat spending as a signal of success, which makes lifestyle creep feel normal rather than risky. And because colleagues tend to earn and spend in similar ways, nobody around you questions the pattern.</p>

<p>None of this is a personal failing. It is simply that the skills that build a high income are different from the skills that build wealth, and nobody teaches the second set in medical school, law school or business school.</p>

<h2>A simple plan to replace the myths</h2>

<ol>
  <li><strong>Calculate your real spending.</strong> Twelve months of bank and card statements, added up honestly. This is the number your financial independence depends on.</li>
  <li><strong>Set a savings rate, not a savings amount.</strong> A percentage grows automatically with your income; a fixed amount does not.</li>
  <li><strong>Automate it on payday.</strong> Investments first, spending from what is left.</li>
  <li><strong>Review your fixed costs once a year.</strong> Mortgages, cars, memberships and subscriptions — the commitments that quietly decide how long you need to keep working.</li>
  <li><strong>Add one income-producing asset at a time.</strong> Start with the simplest, learn it properly, then consider the next.</li>
</ol>

<p>Five steps, most of them done once. That is the difference between knowing the truth behind these myths and acting on it.</p>

<h2>Signs a money myth is costing you</h2>

<ul>
  <li>You know your salary to the dollar but not what you spent last year.</li>
  <li>Your last two raises left no visible change in your savings.</li>
  <li>You have been "about to start investing" for more than a year.</li>
  <li>Most of your net worth is in your home and your retirement account, with nothing producing income now.</li>
  <li>A three-month break from work would put you under real financial strain.</li>
</ul>

<p>If two or more sound familiar, one of the myths above is probably shaping your decisions.</p>

<h2>What these myths look like in real life</h2>

<p><strong>The surgeon with the beautiful house.</strong> Earning well over $400,000, with a large mortgage, two financed cars and private school fees. Every raise went into the next upgrade. On paper, wealthy; in practice, one injury away from serious trouble.</p>

<p><strong>The consultant who waited.</strong> Kept meaning to learn about investing "properly" and left most of her savings in cash for eight years. Nothing was lost on paper, but she missed nearly a decade of compounding she can never get back.</p>

<p>Neither made a dramatic mistake. Each simply believed one myth for long enough for it to matter.</p>

<h2>Frequently asked questions</h2>

<h3>Why do high earners struggle to build wealth?</h3>
<p>Mostly because spending rises with income and investing gets postponed. A high salary makes building wealth possible, not automatic.</p>

<h3>What is the biggest money mistake high earners make?</h3>
<p>Treating a high income as financial security. Without assets, a high earner is one serious disruption away from financial stress.</p>

<h3>How much should a high earner save?</h3>
<p>Twenty percent of gross income is a common baseline; many high earners aim for thirty percent or more, especially if they started late.</p>

<h3>Is it better to pay off debt or invest?</h3>
<p>Pay off high-interest debt first. For low-interest debt such as many mortgages, compare the rate with realistic long-term returns and your own comfort with debt. This article is general information, not financial advice.</p>

<h2>Start with one myth</h2>

<p>Pick the myth that sounded most familiar and act on it this week — open the account, set up the automatic transfer, or calculate your real spending. One small action, repeated every month, does more than any amount of reading about money. Plain conversations about money, without sales pitches, happen every week in <a href="/community">the Circle</a>.</p>
`.trim(),
  },
]
