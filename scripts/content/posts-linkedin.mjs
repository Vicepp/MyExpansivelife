/**
 * The six LinkedIn articles.
 *
 * Topics are drawn from the course material in "mXL document for blog" —
 * module by module — and worded as the questions people actually type into
 * Google. Every post links to at least one other post on this site and one
 * authoritative source off it, which is what gives a crawler (and an answer
 * engine quoting us) something to follow.
 *
 * `excerpt` is doing double duty as the meta description, so it stays under
 * 160 characters. Deliberately no bespoke SEO fields: the admin editor would
 * strip anything it does not know about.
 */

const AUTHOR = { name: 'Dr. Nkem Ezeamama', uid: 'seed' }

export const LINKEDIN_POSTS = [
  {
    slug: 'how-the-linkedin-algorithm-actually-works',
    title: 'How the LinkedIn Algorithm Actually Works (And What It Rewards)',
    category: 'LinkedIn Strategy',
    tags: ['linkedin algorithm', 'linkedin reach', 'content strategy'],
    readMinutes: 5,
    author: AUTHOR,
    coverAlt: 'A laptop screen showing an engagement graph climbing over time',
    excerpt:
      'The LinkedIn algorithm is not hiding your posts out of spite. Here is what it measures, what it rewards, and the four habits that quietly grow your reach.',
    content: `
<p>Most professionals decide the LinkedIn algorithm is against them somewhere around the third post that gets eleven views. It is a reasonable conclusion and it is almost always wrong. The algorithm is not a gatekeeper with an opinion about you. It is a sorting system with one job: work out which posts are worth putting in front of more people, using the only evidence it has — what the first handful of readers did.</p>

<p>Once you understand what it is measuring, the advice that circulates on LinkedIn stops sounding like superstition and starts making sense.</p>

<h2>What the algorithm is actually trying to do</h2>

<p>LinkedIn makes money when people stay on LinkedIn. So the feed is tuned to find posts that hold attention, and it tests every post on a small slice of your network first. If that slice reacts, the post gets shown to a wider circle. If they scroll past, it stops. That is the whole mechanism.</p>

<p>This is why two people with identical follower counts get wildly different results. Reach is not granted by the size of your network. It is earned, post by post, by the behaviour of the first few hundred people who see it.</p>

<h2>The first hour decides most of it</h2>

<p>The initial test window is short. What happens in the first sixty minutes after you publish carries far more weight than what happens on day three, because the algorithm has already made its decision by then and moved on.</p>

<p>That single fact reorganises how you should spend your time. Publishing at a moment when nobody in your network is online is not a small mistake — it means your test audience is asleep. So is publishing and then closing the app, because the comments arriving in that first hour are the strongest signal available and every one of them deserves a reply while the window is open.</p>

<h2>What the algorithm rewards</h2>

<ul>
  <li><strong>Dwell time.</strong> How long someone stops scrolling to read. A post that takes forty seconds to read and gets read beats a clever one-liner that gets a reflexive like.</li>
  <li><strong>Comments over reactions.</strong> A comment is expensive — it costs effort and it is public. The feed weights it accordingly. A post with 12 real comments will usually travel further than one with 90 likes.</li>
  <li><strong>Conversation, not applause.</strong> Replies to comments count, which means your own responses extend the life of your post.</li>
  <li><strong>Consistency.</strong> Not volume. A steady two posts a week teaches the system who your audience is. Six posts one week and silence for a month teaches it nothing.</li>
  <li><strong>Relevance to a specific audience.</strong> Posts that land hard with a narrow group outperform posts that mildly interest everyone.</li>
</ul>

<h2>What quietly costs you reach</h2>

<p>None of these will get you penalised in any dramatic sense. They simply produce weaker signals:</p>

<ul>
  <li><strong>Posting and disappearing.</strong> No replies in the first hour means the conversation dies during the only window that matters.</li>
  <li><strong>Writing for everyone.</strong> Broad, safe, agreeable posts generate nothing measurable. Nobody stops scrolling for a post that could have been written by anyone.</li>
  <li><strong>Treating your profile as a résumé.</strong> People who click through to a job-history page do not follow you, and follows compound.</li>
  <li><strong>Engagement pods.</strong> Identical comments from the same group on every post are trivially detectable and teach the system that your engagement is not real.</li>
</ul>

<h2>What to do about it this week</h2>

<ol>
  <li><strong>Pick two fixed posting slots</strong> and keep them for a month. Consistency is the input you fully control.</li>
  <li><strong>Spend thirty minutes commenting before you post.</strong> Warming up your network is not a trick — it puts you in the feeds of the people whose reaction will decide your reach. This is worth doing well, which is why we wrote a whole piece on <a href="/blogs/how-to-comment-on-linkedin-to-build-authority">commenting in a way that builds authority</a>.</li>
  <li><strong>Stay for the first hour.</strong> Reply to every comment, properly, in a sentence or two.</li>
  <li><strong>Write for one person.</strong> If you cannot name who the post is for, the algorithm cannot work out who to show it to either.</li>
</ol>

<h2>How long before any of this shows up?</h2>

<p>Expect ninety days before the numbers mean much. The first few weeks feel close to shouting into an empty room, and that is normal rather than evidence of failure — you are teaching the system who your audience is, and it needs repetitions to learn.</p>

<p>What changes first is not reach but the quality of who reads you. Someone you wanted to meet appears in the comments. That happens well before the view count does anything impressive, and it is the signal worth watching.</p>

<h2>Common questions</h2>

<h3>Does the algorithm penalise external links?</h3>

<p>Links pull readers off the platform, so posts carrying them tend to be tested more cautiously. It is not a ban and it is frequently overstated. If the link matters, put it in the first comment instead.</p>

<h3>Is there a best time to post?</h3>

<p>Whenever your particular audience is awake and scrolling, which is a question about them rather than a universal rule. Run two slots for a month each and compare — your own data beats blanket advice.</p>

<h3>How often should I post?</h3>

<p>Two to three times a week, held steady, beats daily posting you abandon in a fortnight. Frequency you cannot sustain is worse than a slower rhythm you can.</p>

<h2>The part nobody wants to hear</h2>

<p>The algorithm is not the reason most professionals stay invisible on LinkedIn. Irregular posting is. You cannot out-optimise a habit you do not have, and the system is measuring behaviour over months, not tricks over days.</p>

<p>If you want the mechanics from the source, LinkedIn documents how the feed and profile surfaces work in its <a href="https://www.linkedin.com/help/linkedin" target="_blank" rel="noopener noreferrer">official help centre</a>. And if you want to know what to actually write once you are showing up consistently, start with <a href="/blogs/what-to-post-on-linkedin-five-post-types">the five post types that build visibility</a>.</p>

<p>Working through this with structure and other people beats working through it alone. That is what <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a> is for.</p>
`.trim(),
  },

  {
    slug: 'linkedin-headline-that-gets-you-found',
    title: 'How to Write a LinkedIn Headline That Gets You Found',
    category: 'LinkedIn Strategy',
    tags: ['linkedin headline', 'linkedin profile', 'personal branding'],
    readMinutes: 5,
    author: AUTHOR,
    coverAlt: 'A professional smiling directly at the camera',
    excerpt:
      'Your LinkedIn headline is a search field, not a job title. Here is a formula for one that gets you found by the right people and read in three seconds.',
    content: `
<p>Your LinkedIn headline does more work than any other 220 characters you will ever write. It follows you into every feed, every comment thread, every search result and every connection request. Most people fill it with their job title and never think about it again.</p>

<p>That is a missed opportunity, because the headline is doing two jobs at once — and a job title only does one of them badly.</p>

<h2>The two jobs a headline has to do</h2>

<p>First, it has to make you <strong>findable</strong>. LinkedIn's search indexes your headline heavily. If a recruiter, a client or a partner searches for the thing you do, and the words they typed are not in your headline, you will not appear. It is that mechanical.</p>

<p>Second, it has to make you <strong>worth clicking</strong>. Your headline appears under your name every time you comment on someone else's post. That is the moment a stranger decides whether to look at your profile. "Senior Manager" gives them no reason to.</p>

<h2>Why job titles fail at both</h2>

<p>"Director of Operations" is invisible to search because nobody searches for it — they search for the problem they have. And it is uninteresting to a reader because it describes your position in an org chart they do not care about.</p>

<p>The fix is not to get clever. It is to be specific about who you help and what changes for them.</p>

<h2>A formula that works</h2>

<p>The reliable structure is:</p>

<p><strong>[What you do] | [Who you do it for] | [The outcome or proof]</strong></p>

<p>Worked examples:</p>

<ul>
  <li>Physician turned real estate investor | Helping doctors build income outside the hospital | $153M AUM</li>
  <li>Operations consultant for scaling healthcare practices | I fix the systems that break at 50 employees</li>
  <li>Financial planner for first-generation wealth builders | Plain-English investing, no jargon</li>
</ul>

<p>Notice what these have in common. Each one contains the search terms someone would actually type. Each one names an audience. None of them uses the word "passionate".</p>

<h2>Choosing your keywords</h2>

<p>Do not guess. Write down the exact phrases someone would type if they needed you — not your internal job title, but the problem in their words. "Fractional CFO", "leadership coach for physicians", "commercial real estate syndication". Then check them: search those phrases on LinkedIn and look at who comes up. If the profiles ranking are nothing like yours, your keywords are wrong.</p>

<p>Put the two or three strongest phrases into the headline naturally. Keyword stuffing reads as desperate and LinkedIn does not reward it. Two well-chosen phrases beat six crammed ones.</p>

<h2>The three-second test</h2>

<p>Show your headline to someone outside your industry for three seconds, then take it away and ask what you do. If they cannot answer, it is not working — regardless of how accurate it is.</p>

<p>This is the test most headlines fail. Accuracy and clarity are different things, and only one of them gets you read.</p>

<h2>Common mistakes worth avoiding</h2>

<ul>
  <li><strong>Leaving the default.</strong> LinkedIn auto-fills your headline with your current role. If you have never changed it, you are running the least effective version available.</li>
  <li><strong>Aspirational vagueness.</strong> "Helping people unlock their potential" describes nothing and matches no search.</li>
  <li><strong>Emoji as structure.</strong> A separator or two is fine. A wall of icons makes the text harder to scan and does nothing for search.</li>
  <li><strong>Writing it once.</strong> Your headline should change when your focus changes. Revisit it quarterly.</li>
</ul>

<h2>Rewriting one, step by step</h2>

<p>Take a real example. A hospital pharmacist whose headline reads "Clinical Pharmacist at Regional Medical Center".</p>

<p>Ask what she is actually known for: reducing medication errors in transitions of care. Ask who needs that: hospital quality directors, health-system consultants, digital health founders. Ask what those people type into a search box: "medication safety", "transitions of care", "clinical pharmacy consultant".</p>

<p>The rewrite: <em>Clinical pharmacist | Medication safety and transitions of care | Cut readmission-linked errors 38% across three units</em>.</p>

<p>Same person, same job, same facts. The difference is that the second version is searchable, specific, and gives a stranger a reason to click. It took ten minutes.</p>

<h2>Common questions</h2>

<h3>How long can a LinkedIn headline be?</h3>

<p>220 characters. You do not need all of them — but the default job title uses about thirty, which means most people are leaving the large majority of the field unused.</p>

<h3>Will changing my headline notify my network?</h3>

<p>Profile edits can generate an update to your network, which you can turn off in your profile settings if you would rather change things quietly. Worth checking before you rewrite everything in one sitting.</p>

<h3>Should I include my job title at all?</h3>

<p>Often yes, especially if the title itself carries credibility — physician, attorney, CFO. Lead with it, then add who you help and the proof. The mistake is stopping at the title, not including it.</p>

<h2>Where the headline sits in the bigger picture</h2>

<p>A strong headline gets people onto your profile. What keeps them there is the section underneath it, which is a different craft entirely — we covered it in <a href="/blogs/linkedin-about-section-people-actually-read">how to write an About section people actually read</a>. And what brings people to your profile in the first place is showing up in the feed, which comes back to <a href="/blogs/how-the-linkedin-algorithm-actually-works">understanding what the algorithm rewards</a>.</p>

<p>LinkedIn's own <a href="https://www.linkedin.com/help/linkedin/answer/a522735" target="_blank" rel="noopener noreferrer">guidance on editing your profile</a> covers the mechanics of where to make the change.</p>

<p>Rewrite it today. It takes fifteen minutes and it is the highest-leverage fifteen minutes available to you on the platform. If you want the full profile treated as one system — banner, headline, About, featured — that is <a href="/courses/linkedin-unlocked">module two of LinkedIn Unlocked</a>.</p>
`.trim(),
  },

  {
    slug: 'linkedin-about-section-people-actually-read',
    title: 'How to Write a LinkedIn About Section People Actually Read',
    category: 'Personal Branding',
    tags: ['linkedin about section', 'linkedin profile', 'storytelling'],
    readMinutes: 5,
    author: AUTHOR,
    coverAlt: 'A person writing in a notebook beside a cup of coffee',
    excerpt:
      'Most LinkedIn About sections are a résumé in paragraph form. Here is a story-based structure that builds trust, plus the first two lines that decide everything.',
    content: `
<p>The About section is the most-skipped part of the LinkedIn profile and the most valuable one. It is the only place where you get to explain yourself in your own voice, at length, without a character limit breathing down your neck. Most people waste it by writing a résumé in paragraph form.</p>

<p>Here is what to do instead.</p>

<h2>Only the first two lines are guaranteed to be read</h2>

<p>LinkedIn truncates the About section after roughly three lines on desktop and fewer on mobile. Everything after that sits behind a "see more" link that most visitors never click.</p>

<p>So your opening cannot be a warm-up. "I am a results-driven professional with over 15 years of experience" is a sentence that has never made anyone click see more. Open with the thing that makes someone want the rest: a specific claim, a real number, or the problem you solve stated plainly.</p>

<p>Compare:</p>

<ul>
  <li><em>Before:</em> "Experienced healthcare leader passionate about driving outcomes."</li>
  <li><em>After:</em> "Three years ago I was an ER physician with no audience. Today capital partners find me through what I write."</li>
</ul>

<h2>A structure that holds up</h2>

<p>Four movements, in this order:</p>

<ol>
  <li><strong>The hook.</strong> Two lines. Specific, concrete, and true. Earn the click.</li>
  <li><strong>The turn.</strong> What changed, and why you do what you do now. This is where people decide whether they trust you. Facts build credibility; the reason behind them builds trust.</li>
  <li><strong>The proof.</strong> Three or four lines of evidence — outcomes, numbers, names, scale. Not a duties list.</li>
  <li><strong>The invitation.</strong> One clear next step. What should someone do if this resonated? Message you? Book a call? Read something?</li>
</ol>

<h2>Write it in first person</h2>

<p>Third person ("Nkem is a physician and investor who…") reads as though someone else wrote it, which creates distance at exactly the moment you want closeness. First person is the norm on LinkedIn and it is warmer. Use it.</p>

<h2>Specific beats impressive</h2>

<p>The instinct is to reach for the biggest, roundest claims. Resist it. "Helped numerous organisations achieve significant growth" is impressive-sounding and completely empty. "Raised $153M in assets under management, every capital partner sourced through LinkedIn content" is smaller in wording and enormously bigger in effect.</p>

<p>Specificity is what separates a profile people believe from one they scroll past. If you can replace a number with a bigger one and the sentence still works, the sentence was never saying anything.</p>

<h2>Keywords still matter here</h2>

<p>The About section is indexed by LinkedIn search, so the phrases you chose for <a href="/blogs/linkedin-headline-that-gets-you-found">your headline</a> should appear naturally in the body too. Naturally is the operative word — write for the person, then check that the terms are present, not the other way round.</p>

<h2>End with one door, not five</h2>

<p>A closing line that offers four options — connect, message, email, book, subscribe — gets none of them chosen. Pick the single action that matters most right now and ask for it directly.</p>

<p>"If you are a professional trying to build visibility outside your job title, send me a message. I read all of them."</p>

<h2>What to do if you have no numbers</h2>

<p>Not everyone has assets under management to point at. Plenty of valuable work does not produce a headline figure, and the advice to "lead with results" can feel impossible if you are a teacher, a researcher, a public servant or early in a career change.</p>

<p>Specificity is still available to you — it just takes a different form. Scale ("across four departments"), duration ("eleven years in paediatric intensive care"), difficulty ("the cases nobody else wanted"), or the concrete before-and-after of a single situation you handled. One vivid detail does more than a vague superlative.</p>

<p>The test is not whether the number is big. It is whether a reader could picture what you actually did.</p>

<h2>Common questions</h2>

<h3>How long should the About section be?</h3>

<p>The field allows 2,600 characters. Somewhere between 1,200 and 2,000 is comfortable for most people — long enough to tell a story, short enough that it does not become an essay. Length is much less important than whether the first two lines earn the click.</p>

<h3>Should I write it with AI?</h3>

<p>Use it to get a first draft out of your head and to tighten sentences, then rewrite it in your own words. AI drafts default to a flat, agreeable register that reads as generic, and a generic About section is worse than a short one.</p>

<h3>How often should I update it?</h3>

<p>Whenever your focus changes, and otherwise about twice a year. It is the section people most often write once and forget for five years.</p>

<h3>Does anyone actually read it?</h3>

<p>The people who matter do. Casual scrollers never get past your headline, but anyone seriously considering working with you, hiring you or investing alongside you will read the whole thing before they make contact. It is a small audience doing high-value reading, which is precisely why it repays the afternoon it takes to write properly.</p>

<h2>A short checklist before you publish</h2>

<ul>
  <li>Do the first two lines work with the rest hidden?</li>
  <li>Is there a specific number, name, or outcome in the first half?</li>
  <li>Is it in first person?</li>
  <li>Does it say who it is for?</li>
  <li>Is there exactly one call to action?</li>
  <li>Have you read it aloud? If it is hard to say, it is hard to read.</li>
</ul>

<p>LinkedIn's <a href="https://www.linkedin.com/help/linkedin/answer/a522735" target="_blank" rel="noopener noreferrer">profile editing guide</a> covers where to find the field. The writing is on you — but it is an afternoon's work that pays out every time someone lands on your profile for the next several years.</p>

<p>Once the profile is doing its job, the next question is what to publish. Start with <a href="/blogs/what-to-post-on-linkedin-five-post-types">the five post types</a>, or take the whole system in order inside <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a>.</p>
`.trim(),
  },

  {
    slug: 'what-to-post-on-linkedin-five-post-types',
    title: 'What to Post on LinkedIn: 5 Post Types That Build Visibility',
    category: 'LinkedIn Strategy',
    tags: ['linkedin content', 'what to post on linkedin', 'content strategy'],
    readMinutes: 5,
    author: AUTHOR,
    coverAlt: 'A tidy desk with a laptop, notebook and coffee',
    excerpt:
      'Not knowing what to post is the most common reason professionals go quiet on LinkedIn. These five post types cover almost everything worth publishing.',
    content: `
<p>"I do not know what to post" is the single most common reason professionals stop posting on LinkedIn. It is rarely a lack of things to say. It is the absence of a structure to say them in — every post starts from a blank page, blank pages are exhausting, and after three weeks the habit quietly dies.</p>

<p>Five post types solve this. Almost everything worth publishing on LinkedIn is one of them.</p>

<h2>1. The story post</h2>

<p>A specific moment from your own experience, with a point. Not your life story — one scene. The shift you did not want to take. The deal that fell through. The advice you ignored and regretted.</p>

<p>Story posts outperform almost everything else because they are unmistakably yours. Nobody else can write them, which is precisely why people stop scrolling.</p>

<p><strong>Use when:</strong> you want people to remember who you are.</p>

<h2>2. The insight post</h2>

<p>A single opinion you hold that others in your field might not. Not a hot take for its own sake — a genuine position, argued in a few lines.</p>

<p>"Most physicians treat LinkedIn as a résumé. That is why it does nothing for them." Then three lines explaining why. Insight posts attract the right disagreement, and disagreement in the comments is the strongest reach signal there is.</p>

<p><strong>Use when:</strong> you want to be seen as someone who thinks, not just someone who works.</p>

<h2>3. The educational post</h2>

<p>Teach one small, complete thing. Not everything you know about a topic — one usable piece of it. How to structure a cold email. What a cap rate actually means. The three questions to ask before you take a promotion.</p>

<p>These get saved and shared, which extends their life well beyond the first hour.</p>

<p><strong>Use when:</strong> you want to build authority with people who do not know you yet.</p>

<h2>4. The engagement post</h2>

<p>A genuine question to your audience. Not "thoughts?" bolted onto a statement — an actual question you want the answer to.</p>

<p>"What is the one thing you wish you had known before your first promotion into management?" People answer questions like that at length, and every answer is a comment.</p>

<p>Use these sparingly. A feed of nothing but questions reads as though you have nothing to say.</p>

<p><strong>Use when:</strong> you want to learn something and raise your reach at the same time.</p>

<h2>5. The soft CTA post</h2>

<p>The post that asks for something — a call, a signup, a download — wrapped in something worth reading first. Value up front, ask at the end, no pressure.</p>

<p>The ratio matters enormously here. Roughly one in five, at most. A feed that is mostly asking is a feed people mute.</p>

<p><strong>Use when:</strong> you have built enough goodwill to spend a little.</p>

<h2>How to run them across a week</h2>

<p>A workable two-post week: one story or insight post, one educational post. Add an engagement post when you genuinely have a question. Add a soft CTA when you have something real to offer.</p>

<p>Batch the writing. Sitting down once a week to draft two posts is far more sustainable than trying to think of something every morning, and it is the difference between a habit that survives a busy month and one that does not.</p>

<h2>The structure inside every post</h2>

<p>Whichever type you pick, the anatomy is the same: a hook that stops the scroll, a body that earns the read, a takeaway, and a line that invites a response. Short paragraphs. One idea per line. White space is not wasted space — it is what makes a post readable on a phone.</p>

<h2>Where the ideas come from</h2>

<p>The types tell you what shape a post takes. They do not tell you what to write about, and that is usually the real bottleneck.</p>

<p>Three reliable sources, none of which require inspiration:</p>

<ul>
  <li><strong>Questions you already answer.</strong> Anything a colleague, a junior or a client has asked you twice this year is a post you have effectively already written.</li>
  <li><strong>Decisions you made this month.</strong> Why you chose one approach over another, and what it cost. Decisions are inherently interesting because the reader is facing similar ones.</li>
  <li><strong>Things you changed your mind about.</strong> The strongest posts in most feeds are some version of "I used to think X".</li>
</ul>

<p>Keep a running note on your phone. The problem is almost never a shortage of ideas — it is that the good ones arrive at inconvenient moments and are gone by the evening.</p>

<h2>Common questions</h2>

<h3>How long should a LinkedIn post be?</h3>

<p>Long enough to be worth reading and no longer. Around 150 to 300 words suits most posts. What matters more than length is line breaks: a solid block of text gets scrolled past regardless of how good it is.</p>

<h3>Do hashtags still matter?</h3>

<p>Marginally. Three relevant ones at the end will not hurt and may help categorisation. Ten will make the post look like spam and do nothing for reach.</p>

<h3>Should I post images or video?</h3>

<p>Test it. Formats move in and out of favour and the honest answer is that it varies by audience. A clear, well-written text post consistently outperforms a mediocre graphic.</p>

<h2>Consistency beats brilliance</h2>

<p>Two decent posts a week for six months will do more for your visibility than one exceptional post a quarter. The <a href="/blogs/how-the-linkedin-algorithm-actually-works">algorithm rewards regularity</a> because regularity is how it learns who your audience is.</p>

<p>And publishing is only half of it. The other half is what you do in other people's comment sections — which is <a href="/blogs/how-to-comment-on-linkedin-to-build-authority">a skill of its own</a>. LinkedIn's own <a href="https://business.linkedin.com/marketing-solutions/linkedin-pages" target="_blank" rel="noopener noreferrer">content guidance for pages</a> is worth a skim for the formats it supports.</p>

<p>If a blank page is still the problem, <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a> includes ten pre-structured post templates and a thirty-day content calendar, so the first month is already written.</p>
`.trim(),
  },

  {
    slug: 'how-to-comment-on-linkedin-to-build-authority',
    title: 'How to Comment on LinkedIn to Build Authority (Not Just "Great Post")',
    category: 'LinkedIn Strategy',
    tags: ['linkedin engagement', 'linkedin comments', 'networking'],
    readMinutes: 5,
    author: AUTHOR,
    coverAlt: 'Colleagues in conversation around a laptop',
    excerpt:
      'Commenting well is the fastest way to grow on LinkedIn without posting more. Here is what separates a comment that builds your brand from one nobody reads.',
    content: `
<p>Here is the thing almost nobody tells beginners: on LinkedIn, commenting will grow your visibility faster than posting will — especially in your first ninety days, when your own posts have almost no audience to land in.</p>

<p>A thoughtful comment on a post with 40,000 views puts you in front of 40,000 people. Your own post, early on, might reach two hundred. The maths is not subtle.</p>

<h2>Why commenting works</h2>

<p>When you comment on someone's post, your name and <a href="/blogs/linkedin-headline-that-gets-you-found">headline</a> appear underneath it for everyone who reads that far. If the comment is good, some of them click. It is borrowed reach, and it is entirely free.</p>

<p>It also feeds back into your own posts. Commenting warms up your presence in other people's networks, which means more of them see your next post — the first-hour signal that <a href="/blogs/how-the-linkedin-algorithm-actually-works">the algorithm weights most heavily</a>.</p>

<h2>What a useless comment looks like</h2>

<p>"Great post!" "Well said." "100%." "Thanks for sharing."</p>

<p>These are not rude. They are simply invisible — nobody reads them, nobody clicks them, and they teach the platform nothing. Worse, a feed of them makes you look like someone who engages professionally rather than genuinely.</p>

<h2>What a good comment does</h2>

<p>A comment that earns you attention does at least one of three things:</p>

<ul>
  <li><strong>Adds a piece the post left out.</strong> "This matches what I see in hospital systems — the extra wrinkle is that the approval chain adds six weeks."</li>
  <li><strong>Disagrees with something real.</strong> Respectfully, specifically, with a reason. Thoughtful disagreement is memorable and it starts conversations.</li>
  <li><strong>Extends it with a concrete example.</strong> Your own numbers, your own case, your own outcome.</li>
</ul>

<p>Length matters less than substance, but two to four sentences is the range where most good comments live. One line rarely says enough. Ten lines is a post you should have written yourself.</p>

<h2>A simple structure</h2>

<p>When you are not sure what to write:</p>

<ol>
  <li><strong>React to something specific</strong> in the post — quote or reference an actual line, so it is clear you read it.</li>
  <li><strong>Add your angle</strong> — what your experience says about it.</li>
  <li><strong>Leave a door open</strong> — a question, or a point the author might want to respond to.</li>
</ol>

<p>That last step is what turns a comment into a conversation, and conversations are where connections actually start. Which is a far better opening than a cold request — see <a href="/blogs/linkedin-connection-request-that-gets-accepted">how to send a connection request that gets accepted</a>.</p>

<h2>Who to comment on</h2>

<p>Build a list of twenty to thirty accounts in your field and work it daily. Mix three tiers:</p>

<ul>
  <li><strong>Large accounts</strong> in your industry, for reach.</li>
  <li><strong>Peers at your level</strong>, for genuine relationships and reciprocity.</li>
  <li><strong>Your ideal clients or collaborators</strong>, so the people you most want to know see your name regularly.</li>
</ul>

<p>Twenty minutes a day across that list is enough. This is the daily engagement system, and it is more responsible for early growth than anything else you will do.</p>

<h2>Timing</h2>

<p>Comment early. A comment posted in the first hour, while the post is being actively tested and read, gets seen by far more people than the same comment left the next morning. Set aside the twenty minutes when your niche is most active.</p>

<h2>Two comments, side by side</h2>

<p>The post: a hospital executive writing about why staff retention initiatives keep failing.</p>

<p><em>The invisible version:</em> "So true! Retention is such a challenge right now. Thanks for sharing this."</p>

<p><em>The version that gets clicked:</em> "The part that matches my experience is the exit interview timing. We were surveying people who had already mentally left, so we kept getting polite answers. Moving to a six-month check-in surfaced the scheduling complaints a year before they became resignations. Did you find the same, or was your signal somewhere else?"</p>

<p>The second one took ninety seconds. It demonstrates expertise without claiming any, it gives the author something to reply to, and anyone in that comment section who cares about retention now knows there is someone worth following.</p>

<h2>Common questions</h2>

<h3>How many comments a day is enough?</h3>

<p>Five to ten thoughtful ones beats thirty rushed ones. Twenty minutes is the realistic daily budget for most working professionals, and it is sufficient.</p>

<h3>Does commenting help if my profile is not finished?</h3>

<p>It works against you. Commenting sends people to your profile, so a half-finished one wastes the attention you just earned. Fix <a href="/blogs/linkedin-headline-that-gets-you-found">the headline</a> first — it takes fifteen minutes.</p>

<h3>Should I comment on posts from people far more senior than me?</h3>

<p>Yes, and it is one of the few genuinely level playing fields on the platform. A specific, useful comment gets noticed regardless of your title. Vague agreement does not, regardless of anyone's title.</p>

<h2>What not to do</h2>

<ul>
  <li>Do not pitch. A comment section is not a sales channel and everyone can tell.</li>
  <li>Do not paste the same comment across posts. It is obvious and it reads as automated.</li>
  <li>Do not argue to win. Disagree to add, then let it go.</li>
  <li>Do not tag people for attention. Tag someone only when they genuinely add to the thread.</li>
</ul>

<p>LinkedIn's <a href="https://www.linkedin.com/help/linkedin" target="_blank" rel="noopener noreferrer">help centre</a> covers the platform mechanics; the judgement is the part that takes practice.</p>

<p>Start with twenty minutes a day for two weeks and watch what happens to the reach on your own posts. The daily engagement system is built out in full — including the account list and comment templates by category — inside <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a>.</p>
`.trim(),
  },

  {
    slug: 'linkedin-connection-request-that-gets-accepted',
    title: 'How to Send a LinkedIn Connection Request That Gets Accepted',
    category: 'LinkedIn Strategy',
    tags: ['linkedin networking', 'connection requests', 'outreach'],
    readMinutes: 5,
    author: AUTHOR,
    coverAlt: 'A small group of professionals talking around a table',
    excerpt:
      'Blank connection requests get ignored and pitch-first ones get reported. Here is how to open a LinkedIn conversation that people actually want to have.',
    content: `
<p>There are two ways to send a LinkedIn connection request badly. The first is to send nothing — the blank request, fired off in bulk, that gets accepted at random and leads nowhere. The second is to attach a pitch, which gets you ignored at best and reported at worst.</p>

<p>The version that works sits between them, and it is not complicated.</p>

<h2>Why the blank request underperforms</h2>

<p>A request with no note asks the recipient to do the work of figuring out who you are and why you are there. Some people accept everything, so you will get a number. But a connection who does not know why they connected with you is not a relationship — it is a number in a counter that will never do anything for either of you.</p>

<h2>Why the pitch-first request fails harder</h2>

<p>Leading with a service, a call invitation, or a link tells someone the connection was never about them. It is the LinkedIn equivalent of a stranger handing you a business card mid-sentence. People dismiss these instantly, and enough dismissals will get your account restricted.</p>

<h2>The structure that works</h2>

<p>Three lines. That is all the note field comfortably holds anyway.</p>

<ol>
  <li><strong>Where you came from.</strong> A shared post, a mutual connection, an event, their article. Context removes the "who is this?" reflex.</li>
  <li><strong>Something specific about them.</strong> One line that proves you read something. Not flattery — evidence.</li>
  <li><strong>A low-cost reason to connect.</strong> No ask. Just the honest reason.</li>
</ol>

<p>In practice:</p>

<blockquote><p>"Your post on why physicians struggle to delegate stayed with me — the point about training rewarding self-reliance explains a lot. I work with clinicians moving into investing and hit the same wall constantly. Would like to follow your work."</p></blockquote>

<p>No pitch. No call request. Nothing for them to decline.</p>

<h2>The best requests are not first contact</h2>

<p>The highest acceptance rate comes from requests sent to people who already recognise your name — because you have been <a href="/blogs/how-to-comment-on-linkedin-to-build-authority">commenting thoughtfully on their posts</a> for a couple of weeks first.</p>

<p>Engage first, connect second. It inverts the usual order and it works far better, because by the time the request arrives you are not a stranger.</p>

<h2>What to do after they accept</h2>

<p>This is where most people go wrong. Someone accepts, and an automated pitch lands within the hour. Do not do this. It undoes everything the careful request just built.</p>

<p>Three openings that work instead:</p>

<ul>
  <li><strong>Appreciation.</strong> Reference something specific of theirs that was useful, and say why.</li>
  <li><strong>Curiosity.</strong> Ask one genuine question about their work. Genuine meaning you actually want the answer.</li>
  <li><strong>The resource share.</strong> Send something relevant with nothing attached. An article, an introduction, a name.</li>
</ul>

<p>Sometimes the right move is to say nothing at all and simply keep engaging with their posts. Not every connection needs to become a conversation this week.</p>

<h2>Volume, and the limit that catches people out</h2>

<p>LinkedIn caps how many invitations you can send, and the ceiling tightens if a high share of yours go unanswered or get marked "I don't know this person". Ten to fifteen personalised requests a week, sent to people who have seen your name, will outperform two hundred blank ones — and will not put your account at risk. The current rules live in LinkedIn's <a href="https://www.linkedin.com/help/linkedin/answer/a554398" target="_blank" rel="noopener noreferrer">help documentation on invitation limits</a>.</p>

<h2>Three notes worth copying</h2>

<p><strong>After engaging on their content:</strong> "We have been in the same comment threads on a few of Dr. Okafor's posts about physician burnout. Your point about staffing ratios being a symptom rather than the cause is the argument I keep trying to make badly. Would like to follow your work properly."</p>

<p><strong>After an event:</strong> "We were both at the operations panel in Atlanta on Thursday — you asked the question about throughput that the panel dodged. I have been thinking about it since. Connecting so I can keep up with what you are working on."</p>

<p><strong>Through a mutual connection:</strong> "Aisha Bello mentioned your name when I asked who actually understands revenue cycle in mid-size practices. I work with clinics at that stage and would value being connected."</p>

<p>Each one is under fifty words, names something real, and asks for nothing. That is the entire formula.</p>

<h2>Common questions</h2>

<h3>How many connection requests can I send?</h3>

<p>LinkedIn applies a weekly limit that tightens if too many of yours go unanswered or get marked as unwanted. The exact figure moves, so treat the limit as a signal rather than a target — if you are near it, you are sending too many, too cold.</p>

<h3>Should I connect or follow?</h3>

<p>Follow when you want their content and have no particular reason to speak. Connect when there is a genuine reason for a two-way conversation. Following first, then connecting once you have engaged for a few weeks, works better than either alone.</p>

<h3>What if they do not accept?</h3>

<p>Withdraw the invitation after a few weeks so it does not count against you, and carry on engaging publicly. Plenty of people accept the second request months later, once the name is familiar.</p>

<h2>Networking is not the same as selling</h2>

<p>The point of a professional network is not a pipeline. It is that when you need advice, a referral, a hire, a second opinion or a door opened, there are people who know your work well enough to help — and who you have helped first.</p>

<p>That takes months, not a campaign. It is the same argument for building relationships offline, which we made in <a href="/blogs/how-to-build-a-professional-network-mid-career">how to build a professional network mid-career</a>.</p>

<p>If you want the scripts — connection notes, opening messages, and what to say when someone reaches out to you — they are in <a href="/courses/linkedin-unlocked">LinkedIn Unlocked</a>. Or come and practise on people who are doing the same thing inside <a href="/community">the Circle</a>.</p>
`.trim(),
  },
]
