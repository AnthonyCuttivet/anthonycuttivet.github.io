const data = [
  {
    title:
      "<span style=color:var(--accent);>※</span> Entry 0 : All you need is Skill",
    summary: "08 April 2025 - 22:47  「Starter」",
    content: `
    <div class="entry-block">
      <div class="entry-content-text">
        <p>It all started with a simple question: “Am I skilled enough to make a juicy brawler with little to no visual assets?”</p>
        <p>And here we are, trying to see it through.</p>
        <p>The goal is kinda simple: produce a combat engine — a package containing everything needed to easily make juicy, animation-driven gameplay. Embed it into a game, profit.</p>
        <p>For the “game” part, and to have an actual work canvas, we decided to go with a minimalistic 2D Top Down in Godot Engine, while re-creating the combat feeling of <strong>Phantasy Star Online 2</strong>: fast, skilled and punitive; easy to learn, satisfying to master.</p>
        <p>In the end, to make this a reality, <strong>All I need is Skill</strong>.</p>
      </div>
      <div class="entry-media">
      <div class="video-wrapper">
        <iframe
        src="https://www.youtube.com/embed/YveFmUyvdeo"
        title="Demo Video"
        frameborder="0"
        allowfullscreen>
        </iframe>
      </div>
        <small>All current features available in the Engine</small>
      </div>
    </div>
    `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
  {
    title:
      "<span style=color:var(--accent);>※</span> Entry 1 : How to arrange animations ?",
    summary: "12 April 2025 - 00:48  「Everything But The Rain」",
    content: `
    <div class="entry-block">
      <div class="entry-content-text">
        <p>The first step at making animation-driven gameplay is actually playing animations.</p>
        <p>But we had to be smart about how we're arranging them.</p>
        <p>We could have dumped all player animations into a gargantuan animation graph, called it a day and then shove half a bottle of wine down our throat any time we have to add a new one; to forget how much pain it is.</p>
        <p>This time, and to avoid emptying our wine cellar in 2 weeks, we tried packing animations together, by category, and dynamically updating which animation packages are currently loaded by the player.</p>
        <p>Because the player can freely switch weapons mid-combat, we went with packing attack animations by weapon type. And it worked quite well.</p>
        <p>We went with 2 animlibs for proof of concept: Default and Sword.</p>
        <p>Default packs every standard animation an entity will need like "idle", "dash", "cast", "death" while Sword packs any sword-related animation: "sword_combo_1", "sword_combo_2", "sword_combo_3", "sword_combo_dash_attack", "sword_combo_CaliburStreak".</p>
        <p>This opens some interesting answers to popular gameplay situations: the player is in the water and needs to swim instead of walk? Just swap the "default" animlib for the "default_water" one, and swap back once out of the water.</p>
      </div>
    </div>
    `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
  {
    title: "<span style=color:var(--accent);>※</span> Entry 2 : 2D Root Motion",
    summary: "18 April 2025 - 03:10  「The Shooting Star Project 2」",
    content: `
    <div class="entry-block">
      <div class="entry-content-text">
        <p>Animation-driven gameplay is really rad but without root motion we won't be going far.</p>
        <p>Sadly, Godot Engine does not ship with 2D root motion in, only 3D root motion is available from scratch. Will this stop us? Hell no it won't.</p>
        <p>Root Motion is kinda easy to implement. All we need to do is extract the transformation applied to the root joint of an animation at a given frame, apply it to the root node of an object and then reset the root joint local position.</p>
        <p>Because the root node is parent to the root joint, applying root motion on it will also displace the root joint, which we don't want because we already moved it, so resetting the local position snaps it back to compensate for the parent translation.</p>
        <p>And it's on the same frame so no risk for a visual artifact.</p>
        <p>It works, great! But no matter the direction the entity is facing, it always goes towards the right side of the world…</p>
        <p>That's because we applied the raw root motion, meaning it will apply absolute coordinates depending on the world orientation, not the entity's one.</p>
        <p>Fixing it is trivial, as we only need to transform the raw Root Motion into the entity's local space by multiplying it with its forward vector and voilà, fully working 2D Root Motion!</p>
      </div>
      <div class="entry-media">
        <div class="video-wrapper">
          <iframe src="https://www.youtube.com/embed/Mw-oOGoG4H0" title="2D Root Motion in Godot" allowfullscreen></iframe>
        </div>
        <small>Basic handmade 2D Root Motion features for Godot Engine, full of flaws (for now).</small>
      </div>
    </div>
    `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
  {
    title:
      "<span style=color:var(--accent);>※</span> Entry 3 : Fortuna Animation",
    summary: "27 April 2025 - 20:21  「Stroke of Sanity」",
    content: `
    <div class="entry-block">
      <div class="entry-content-text">
        <p>To keep things clean and work in a separated environment we went ahead and made Fortuna, our Custom Animation System for Godot.</p>
        <p>Handling animation cancels and overrides is a pain in the ass most of the time while being one of the core gameplay mechanics of high intensity combat. There’s something beautiful in executing a perfect animation cancel to maximise efficiency, while empowering the player by giving them full control over their character.</p>
        <p>A recurring issue in Gameplay Programming is handling the behaviour of a character when two different animations are triggered almost simultaneously, oftentimes leading to visual artifacts at best and blocking the character’s animation state at worst.</p>
        <p>For example, let’s say we want to make a heavy hammer attack and strongly emphasize the weight of the animation. We make it so that the recovery portion of the animation cannot be cancelled by the player in order to really feel the aftermath of slamming a 100 kg hammer onto the ground.</p>
        <p>In code we would have a script that blocks player actions if the current animation position is flagged as “non cancellable” and it would work, albeit a bit suboptimal because it would run often.</p>
        <p>Now let’s imagine that we add a new ability that can specifically cancel “non cancellable” animations. We’ll have to check if the player is trying to do this very ability when inside the Hammer Slam recovery. And now let’s add a special dodge that can cancel animations but only during the second half of recovery and so on, it becomes hardly maintainable, and hard to work with with tons of edge cases.</p>
        <p>This is where Fortuna Animation comes in: every Fortuna Animation has a mandatory “in_priority” and an “out_priority” to solve this problem.</p>
        <p>Anytime a new Fortuna Animation is played, the Fortuna Animation Player will compare its “in_priority” with the already playing animation’s “out_priority”. If greater, it overrides it, if not, it rejects it.</p>
        <p>To return to our example, with the Fortuna system this time, the Hammer Slam animation would have been a (3/4 - meaning 3: “in_priority”, 4: “out_priority”). Every animation with an “in” of 4 or less cannot cancel it but our Special Dodge would have been a (5/4), and with these stats, it can cancel the Hammer Slam. Without any additional logic needed, awesome no?</p>
        <p>The best part? It does not stop here. I lied a little when saying every Fortuna Animation has an “in” and “out” value. In reality it has a FrameData that can specify its new “out” value at any frame. Meaning we can make an animation that cannot be cancelled for its first X frames, become cancellable by certain animation for the next Y frames and cancellable by anything for the last Z frames.</p>
        <p>This way we can easily and quickly fine tune animations without ever needing to write code for it. Custom code can always be added for ultra specific cases but this animation architecture handles most cases naturally.</p>
      </div>
      <div class="entry-media">
        <div class="video-wrapper">
          <iframe src="https://www.youtube.com/embed/0XDEADEAD" title="2D Root Motion in Godot" allowfullscreen></iframe>
        </div>
        <small>One of Fortuna's features used in another project : Automatic spritesheet unpacking and creation of animations.</small>
      </div>
    </div>
    `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
  {
    title:
      "<span style=color:var(--accent);>※</span> Entry 4 : Fortuna x Root Motion",
    summary: "28 April 2025 - 01:43 「Urge to Unite」",
    content: `
    <div class="entry-block">
      <div class="entry-content-text">
        <p>One of the best perks of having a custom animation system is that you can add pretty much anything inside to accelerate future development times.</p>
        <p>And why not let Fortuna Animation Player extend our newly born 2D Root Motion to new heights?</p>
        <p>2D Root Motion works, and is applied correctly, great, but we could do so much more with it. Wouldn’t it be cool if the 2D Root Motion automatically detects obstacles and modulates itself to stop an animation’s root motion before colliding into something? Sounds cool? Let’s do it!</p>
        <p>The first step at detecting obstacles is always the same: Raycast.</p>
        <p>Because we know how much root motion will be applied on the current frame, we can easily make our raycast the length of the root motion we are about to apply.</p>
        <p>This way, if the raycast returns a collision, we know that if we apply 100% of this frame’s Root Motion we will collide with something. To account for it, we only need to take the ratio between our Root Motion’s length and the distance between the entity and the point of collision and instead of applying all of the root motion, only apply X% of it, X being said ratio.</p>
        <p>Our entity will now stop right before any obstacle, while continuing the animation, making overall movements much more pleasant for the player.</p>
        <p>We could stop here.</p>
        <p>BUT WE CAN GO EVEN FURTHER!</p>
        <p>Do we want our character to slash exactly with the tip of its weapon? We apply the ratio of Root Motion equal to the distance to the collision point minus the length of the weapon!</p>
        <p>Do we want our character to be at melee range of its target exactly at frame 46 of the current animation? Easy! We implement the “attack attraction” from God of War 4’s GDC talk by completely overriding the Root Motion of each frame from 0 to 45 and apply 1/46th of the distance to the target as Root Motion!</p>
        <p>That’s why custom animation systems are so good—the possibilities are infinite, and everything can be toggled on/off and controlled from inside the animation file, a bit like Unreal Engine’s Animation Notifies.</p>
      </div>
      <div class="entry-media">
        <div class="video-wrapper">
          <iframe src="https://www.youtube.com/embed/Mw-oOGoG4H0" title="Fortuna Root Motion Extensions" allowfullscreen></iframe>
        </div>
        <small>Improvements over basic 2D Root Motion behaviour by combining them with custom logic, step by step.</small>
      </div>
    </div>
    `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
  {
    title:
      "<span style=color:var(--accent);>※</span> Entry 5 : Combat Gamefeel Trinity",
    summary: "23 May 2025 - 19:52  「Five Ways To Three Figures」",
    content: `
    <div class="entry-block">
      <div class="entry-content-text">
        <p>Strangely enough, in games centered around combat, just hitting things is nowhere near enough for it to feel satisfying. But what should we add to a game to make it juicy and satisfying?</p>
        <p>In our book, the 3 mandatory elements of Gamefeel to add are part of our “Gamefeel Trinity”: Hitflash, Hitstop and Hitshake.</p>
        <p>Some really useful resources explaining these are the following videos, about hitstop in detail by @SugarPunch and with a more holistic approach by Masahiro Sakurai, creator of Kirby and the Super Smash Bros fighting games series:</p>
      </div>
      <div class="entry-media">
        <div class="video-wrapper">
          <iframe src="https://www.youtube.com/embed/s4HKw7Hqqd0" allowfullscreen></iframe>
        </div>
        <div class="video-wrapper">
          <iframe src="https://www.youtube.com/embed/tycbMSjDDLg" allowfullscreen></iframe>
        </div>
      </div>
    </div>
    `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
  {
    title:
      "<span style=color:var(--accent);>※</span> Entry 6 : Combat Gamefeel in action",
    summary: "25 May 2025 - 02:07  「Can't Fear Your Own Sword」",
    content: `
    <div class="entry-block">
      <div class="entry-content-text">
        <p>If we want to make a Combat Engine, we must be able to make the previously mentioned Gamefeel components easily available and usable.</p>
        <p>The Hitflash one is the simplest and the only one that needs something other than code: a shader. To be more precise, a simple shader that is capable of overriding its owner's texture color and painting it white for a short duration—nothing too fancy there. Tweening the value to gradually become white from transparent and vice versa is a huge bonus too!</p>
        <p>Next, the Hitstop!</p>
        <p>This one is a little trickier because it is often based on the animation of the entities involved.</p>
        <p>To make the most straightforward Hitstop between two entities we simply have to pause the animation of both entities for half a second. This would not feel really satisfying but it would at least work.</p>
        <p>And this is where we come in, to improve upon.</p>
        <p>We can start by adding the possibility to have two different durations of Hitstop and introduce the idea of “attack animation advantage.” Giving the player, via the Gamefeel, a better time at a game while not explicitly telling them works wonders. This advantage can be as subtle as hitstopping the player character for 0.15s while hitstopping its target for 0.2s, making it easier for the player to land another hit and so on.</p>
        <p>Obviously this should not get in the way of a game’s balance, and while this would work in a PvE game, it would be better not to use it in a PvP game, especially in a competitive one.</p>
        <p>Finally comes the Hitshake! Way less often seen in games, it’s a hit technique mainly used in Super Smash Bros and explained by its creator, Masahiro Sakurai, in his videos.</p>
        <p>The idea behind it is quite simple: make the entity receiving a hit shake slightly during its Hitstop window. This visual-only effect strongly enhances the “you actually influenced the world with the action you just did,” as long as it is configured correctly.</p>
        <p>Super Smash Bros also tweaks this concept during aerial hits, by allowing the shake to be omnidirectional for a much stronger effect, as opposed to the grounded one, only shaking along the surface.</p>
      </div>
      <div class="entry-media">
        <div class="video-wrapper">
          <iframe src="https://www.youtube.com/embed/UlnWBz8QDBc" title="Combat Gamefeel Demo" allowfullscreen></iframe>
        </div>
        <small>Presentation then stacking of Attack Game Feel layers.</small>
      </div>
    </div>
    `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
  {
    title:
      "<span style=color:var(--accent);>※</span> Entry 7 : God, I hate handling Inputs",
    summary:
      "04 June 2025 - 02:01  「Everything Relating to the Crumbling World」",
    content: `
      <div class="entry-block">
        <div class="entry-content-text">
          <p>Handling inputs has always been a pain, a real pain.</p>
          <p>Some engines have helped make this aspect of Gameplay Programming simpler, especially Unreal Engine with its Actions system, making it really easy to connect logic to simple input states.</p>
          <p>But as far as we know, no general public engine has got an out-of-the-box system designed to handle multiple trigger conditions for the same input, that are dynamically configurable while not being tied to external resources.</p>
          <p>This is why we tried architecting an Input solution that would make our life easier by addressing some of the problems listed before.</p>
          <p>In Phantasy Star Online 2, the game we are using as a base, certain abilities inputs can be held down a certain time to gain bonus attributes. Additionally, to provide feedback for the player when an ability has been held down long enough to start charging, an FX is displayed over their character after a 0.5s charging duration.</p>
          <p>When the input is released, if it has been held for at least the charging duration, the charged ability is cast, otherwise it is the normal.</p>
          <p>With just this simple use case, we need to check our input at least 3 times:</p>
          <ul>
            <li>After a 0.5s hold, to feedback the start of the charging state</li>
            <li>After being held for the duration needed by the charged version of the ability, to feedback its availability</li>
            <li>After being released, to execute the corresponding version of the ability</li>
          </ul><br/>
          <p>One way to approach this would be to store a reference to the actual InputInfo, manually compute its hold time every frame and trigger said logic every time a certain threshold is met.</p>
          <p>This would work but would require manually doing this for every input in code and with a few edge cases would become very tricky to maintain and strange bugs would most likely start to appear.</p>
          <p>Instead, we created an InputStateTracker Singleton responsible for tracking only registered InputActions and updating their corresponding InputInfo (a struct containing the state as well as the thresholds and event flags).</p>
          <p>This alleviates the need to manually update inputs, and because it is using InputActions, rebinding is very easy. For performance’s sake, you have to register an InputAction for it to be tracked and choose to unregister it or not once consumed.</p>
          <p>When registering an input for its tracking, you can choose which events to emit once certain conditions are met. These events are set using bitflags for minimal memory usage and are: on_pressed, on_released, on_held and on_held_custom.</p>
          <p>The InputStateTracker automatically connects each InputInfo to its desired events and emits them when necessary. These events being dispatched to an EventBus, any part of the codebase can connect to them and execute its own logic once received, without any coupling.</p>
          <p>And that’s it. To get back to our charged ability example, here’s what we would have to do for it to work:</p>
          <ul>
            <li>Track the corresponding ability InputAction when the player equips it and enable the 4 events, with 0.5s for the custom_held and the ability charge duration for the held one.</li>
            <li>Connect the pressed event to the UI for immediate visual feedback, held_custom event and held to the player for triggering FX feedback.</li>
            <li>Connect the released event to the ability system to actually execute the ability.</li>
            <li>Profit?</li>
            <li>Go meet with friends for a glass of wine.</li>
          </ul><br/>
          <p>This surprisingly lightweight architecture works as intended and allowed us to easily track any kind of multi-state inputs without having to rely on multiple update loops, and that is f*cking great.</p>
        </div>
        <div class="entry-media">
          <div class="video-wrapper">
            <iframe src="https://www.youtube.com/embed/D4-UB27chHE" title="Inputs" allowfullscreen></iframe>
          </div>
          <small>Instant cast vs Charged cast Input. Illustration of this entry's main reflexion.</small>
          <br/>
          <img src="../img/battle_engine/inputs.png" alt="InputStateTracker diagram" />
          <small>InputStateTracker architecture and execution flow.</small>
          <br/>
          <img src="../img/battle_engine/input_example.png" alt="InputStateTracker diagram" />
          <small>Fireball Ability input tracking setup example.</small>
        </div>
      </div>
      `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
  {
    title:
      "<span style=color:var(--accent);>※</span> Entry 8 : Anything can be a Command",
    summary: "11 June 2025 - 00:15 「TRIGGER FOR A NEW CONCERTO」",
    content: `
    <div class="entry-block">
      <div class="entry-content-text">
        <p>When reading the previous entry, about our new Input Tracking System, something must have felt off: how are they handling the logic to be executed when an event is triggered?</p>
        <p>Because as it stands right now, they still have to account for different input actions, not only ability actions.</p>
        <p>And you would be absolutely right! We purposely glanced over this aspect just for this entry.</p>
        <p>Have you ever heard of the Command Programming Pattern? If we had to pick a favorite programming pattern this one would be on top. It’s a fantastic way to make decoupled, reusable and interchangeable blocks of logic.</p>
        <p>Our first encounter with the Command Pattern was during our first reading of Game Programming Patterns, a very cool book written by Richard Nystrom centered around useful Programming Patterns for Game Programming.</p>
        <p>Commands are hecking cool when it comes to having a wide diversity of logic that can be executed from one source. In our case, executing gameplay logic from having a key released.</p>
        <p>One could code a gigantic switch statement to handle every type of logic and another could split them into Commands.</p>
        <p>Each CustomCommand is an extension of the parent Command Interface that only has a single execute() function.</p>
        <p>This is where we write our custom logic, inside the execute() of our newly created CustomCommand.</p>
        <p>Want to execute an Ability? CommandExecuteAbility, with an ability property. Want to use an item? CommandUseItem with an item ID and a target. This item is a consumable in a stack? CommandUseConsumable with the same item ID. Want to get hired in a cool video game studio? CommandHireFunnyDeveloper with a resume property.</p>
        <p>With Commands, the possibilities are infinite and every Command is reusable elsewhere. The player has to automatically consume a potion during the tutorial? Easy, simply trigger the CommandUseItem from the tutorial logic.</p>
        <p>In our Input System, the events are actually connected to Triggerables, an Interface containing a Command, for the logic and a Payload, for the arguments. When an event fires, the connected Triggerable will trigger its Command and the logic will be executed from there.</p>
        <p>Commands are also easily stackable. You could store each executed Command in an array and have a replayable history of every action the player did. Perfect if you want to make a time-rewind mechanic or a replay feature!</p>
      </div>
      <div class="entry-media">
        <img src="command-pattern-diagram.png" alt="Command and Triggerable" />
        <small>The Command/Triggerable pipeline that decouples input, events, and logic.</small>
      </div>
    </div>
    `,
    image: "https://picsum.photos/id/1011/1600/900",
  },
];
