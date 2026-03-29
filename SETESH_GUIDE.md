# Setesh New Player Guide

> **Last updated**: 2026-03-29
> **Fact-check status**: All claims sourced and verified where possible. Unconfirmed claims flagged with [UNCONFIRMED].

---

## Mission Chain: Step by Step

> **Note**: Individual mission names are poorly documented across community wikis. Only 3 official mission names are confirmed from release notes and forum threads. The full mission database exists on EntropiaWiki and Entropia Nexus but requires in-browser access (dynamic pages). The sequence below is reconstructed from player accounts across forum threads and release notes.
>
> **To contribute**: If you have the full mission list from in-game, this section needs your help. Check Ripcraze.com or Entropia Nexus for the interactive mission tracker.

### Step 1: Arrival & Orientation
- Your dropship lands at **Port Cabrakan**, the main hub city on Setesh
- Look around, get oriented — Calypso is visible in the sky

### Step 2: Talk to Security Chief Harkov
- Harkov is your primary quest giver for the main mission chain
- Accept **"A New Arrival"** [CONFIRMED mission name — VU 19.0.0 release notes]
- **Rewards**: Standard Undersuit, SET-P1 Civilian Sidearm (0.10 PED TT), 0.20 PED Universal Ammo
- If you somehow miss the Undersuit, talk to Harkov again to get it

### Step 3: Movement Tutorial
- Basic controls: WASD movement, jumping, camera

### Step 4: First Hunt — Low-Level Creatures
- Harkov sends you after starter mobs: Sickly Exas, Derpis, Pupugi
- **Tips**:
  - Derpis travel in swarms — don't aggro multiple at once
  - Stay near the revive terminal (there's no heal terminal nearby)
  - All Setesh mobs use **shared loot** — no kill-stealing, beginner-friendly

### Step 5: Target Holo Training
- Practice shooting at holograms at **Iron Stronghold**
- **Warning**: Higher-level players sometimes camp this area with explosive weapons, blocking targets. If it's occupied, move on and come back later

### Step 6: Progressive Hunting Missions
- Kill-count missions for various creatures
- Advances your **Codex** (creature kill tracker — milestones grant skill rewards)
- Rewards: **armor plates** (8-10 pieces across multiple missions, varying styles — not a complete matching set)

### Step 7: Robot Base Mini-Boss
- Scripted encounter at the **Robot Base** — one of the gameplay highlights
- Kill robots, loot **Robot Scrap** (now stackable as of VU 19.0.2)
- Coordinates: entrance at [68026, 69510], TP at [68000, 69415] (TP may malfunction)

### Step 8: Crafting Tutorial — "A Helping Hand"
- [CONFIRMED mission name — forum feedback thread]
- Requires: kill robots, loot scrap metal, craft **Intake Manifolds**
- **CRITICAL BUG**: You MUST craft manually. The auto-crafter will cause the mission to hang. If stuck, abandon and retry the mission
- Intake Manifolds are now stackable (fixed VU 19.0.2)
- Scrap metal only drops during the active robot-kill phase and is untradeable

### Step 9: Mining Tutorial
- NPC: **Specialist Mel** at **Outpost Hunraqan**
- Teaches basic mining — yields primarily **oil and lysterium**
- **Bug**: Won't trigger if you already completed the Thule mining tutorial. Workaround: accept **"Savannah Survey"** mission instead [CONFIRMED mission name — VU 19.0.2 release notes]

### Step 10: Exploration & Side Missions
- **Burger Task** (community nickname — official name unknown): collect red mushrooms and green leaves
  - No waypoints provided — requires exploring multiple biomes
- **Secrets and side missions** connecting to future content are scattered throughout

### Step 11: Vehicle Mission
- Rewards a **free Hover Bike** — amphibious, fast, minimal oil consumption
- **Warning**: Cannot be repaired at 0 TT value. Terrain damages it. Ride carefully

### Step 12: Adjusted SET-P1 Mission
- Available in **Port Cabrakan** [CONFIRMED — VU 19.2.0 release notes, added post-launch]
- Rewards an **Adjusted version of the SET-P1 Civilian Sidearm** (upgraded stats — see weapon deep-dive)

### Step 13: Daily Missions (Repeatable)
- **Trader Joel** (Port Cabrakan) — daily hand-in missions: exchange specific items for rewards
- **Trader Joanna** (Camp Icarus) — same concept, different location
- Both are "hand-in" style missions [CONFIRMED — VU 19.0.0 release notes]

### Step 14: Leaving Setesh
- Use the terminal in the building near the **Trading Post** to skip remaining tutorial
- VTOL to **Camp Icarus**, then onward to **Port Atlantis** on Calypso
- Port Atlantis underwent a major remake in VU 19.2.0 specifically as the Setesh exit point

---

## Gear Earned from Missions

| Item | Details | Watch Out |
|---|---|---|
| SET-P1 Civilian Sidearm | 80% eff, 1.4 DPS | Don't TT it — see weapon section |
| Adjusted SET-P1 | Upgraded version, 9.771 DPP | Mission reward from Step 12 |
| Armor Plates (8-10) | ~17 PED TT total | Can't sell to TT, CAN discard (fixed 19.0.2) |
| Vivo S10 Heal Tool | Previously from Gauntlet, now from Setesh missions | Untradeable — don't accidentally over-repair at terminal |
| Free Hover Bike | Amphibious, fast, low oil use | Can't repair at 0 TT — terrain damages it |
| Standard Undersuit | From "A New Arrival" (Step 2) | |
| Wasp HC (L) | Weapon reward | Has inventory interface bug ("failed to execute") |

---

## SET-P1 Weapon Deep-Dive

### SET-P1 Civilian Sidearm (Base)
| Stat | Value | Verified? |
|---|---|---|
| Type | Pistol | Yes |
| Efficiency | ~80% | Yes — WIP review, expansion proposal |
| DPS | ~1.4 | Yes — WIP review |
| Ammo Burn | 7 per shot (original) | Yes — WIP review, expansion proposal. See nerf note below |
| TT Value | 0.10 PED (when given) | Yes — feedback thread |
| Tierable | Yes (Tier 1 data on EntropiaWiki) | Yes — MindArk dev response |
| Tier Rate | Slow | Yes — MindArk dev: "Tiering works normally. It may happen rather slowly though" |

### SET-P1 Ammo Burn Change
> **[UNCONFIRMED — single source only]** One forum user on page 2 of the feedback thread claims ammo burn was increased from 7 to 20 during a maintenance window with no patch notes. They calculated this reduced available playtime from ~65 hours to ~25 hours with starter resources. Their theory: "they changed the ammo burn to 20 in order to lower DPP so that the tiering will be much more accessible for noobs."
>
> **No official patch notes document this change.** We checked VU 19.0.0 through 19.5.0 release notes — no SET-P1 balance changes mentioned. This could be accurate (stealth change) or a misunderstanding. **Verify in-game before publishing.**

### SET-P1 Civilian Sidearm, Adjusted
| Stat | Value | Verified? |
|---|---|---|
| DPP (Damage Per PEC) | 9.771 | Yes — PCF DPP analysis thread |
| How to get | Mission in Port Cabrakan | Yes — VU 19.2.0 release notes |
| Best for | Punies / lowest tier mobs | Yes — DPP thread |

**Comparison**: Most weapons sit around 3 DPP. The Adjusted SET-P1 is ~3x more efficient than the Frontier Hunting Rifle, Adjusted (3.82 DPP).

### Community Analysis: DPP & Loot
From the PCF "DPP Doesn't Matter" thread:
- Player tested Adjusted SET-P1 vs Frontier Hunting Rifle on same mobs
- Despite 9.77 vs 3.82 DPP, loot returns were actually LOWER with the SET-P1
- Under **Loot 2.0**, DPP doesn't affect total loot value — only composition
- Real value of high DPP: **more kills per PED** = better rare drop chances + faster codex completion

### What This Means for New Players
The SET-P1 is designed to:
1. Stretch your starting PED as far as possible
2. Complete kill-count missions faster per PED spent
3. NOT necessarily profit more per run — loot returns scale with cost input, not efficiency

### Full Stat References (dynamic pages — check in-browser)
- EntropiaWiki: http://www.entropiawiki.com/Info.aspx?chart=Weapon&id=3083
- Entropia Nexus: https://entropianexus.com/items/weapons/SET-P1~Civilian~Sidearm
- EntropiaWiki Tier 1: http://www.entropiawiki.com/Info.aspx?chart=Tier&id=1765

---

## What the Tutorial Doesn't Teach

### Economy Fundamentals
- **1 PED = $0.10 USD** — fixed rate, 10 PED = $1 [CONFIRMED — official EU site, Wikipedia]
- **1 PED = 100 PEC** — like dollars and cents [CONFIRMED]
- **TT Value** = base Trade Terminal value — what the game always buys an item back for
- **Markup** = what players pay above TT. Example: 1 PED TT item selling for 1.50 PED = 150% markup
- **Nanocubes**: recycling items at TT gives nanocubes worth 100.5%–103% — sell on auction or to players
- **Return rates**: [UNCONFIRMED — single player's experience] ~90% per cycle. Their trajectory: 30 > 27 > 24 > 21 > 19 > 17 > 15 > 14 > 13 > 11 PED. Your mileage will vary
- **Rule of thumb**: only sell items with 102%+ markup to players/auction. TT everything else
- **Starter ammo budget**: [UNCONFIRMED — single source] ~30 PED total from missions

### Auction House
- **Minimum fee**: 0.5 PED per transaction, paid by seller [CONFIRMED]
- **Fee formula**: `Commission = 0.5 + (99.5 x MU) / (1990 + MU)` where MU = markup amount in PED [CONFIRMED — PCF auction fee thread]
- Fee is calculated only on the markup, not the TT value
- At most 5% of the markup amount, decreasing as markup increases
- **Warning**: selling 10 PED of items at 101% = 0.10 PED profit - 0.50 PED fee = **net loss**
- **Buy orders**: check what people are offering before listing — filling a buy order can be faster
- Strategy: buy bulk at lower price, sell smaller lots at higher price

### Sweating (Free Income — Not Taught in Tutorial)
- **Tool**: VSE Mk 1 — free, never breaks [CONFIRMED]
- **How to equip**: press I (inventory) > Tools tab (wrench icon, 5th from top) > right-click VSE Mk1 > Equip
- **How to use**: stand near creature, press **E** (single attempt) or **F** (repeat extraction)
- **Yield**: 1–4 Vibrant Sweat per success, many failures between [CONFIRMED — multiple sources]
- **Current price**: ~1.65 PED per 1,000 bottles (2025-2026). Fair range: 1.5–2.0 PED/1k [CONFIRMED — EntropiaGO]
- **Cannot sell to TT** — must sell directly to players [CONFIRMED]
- **Time investment**: ~2 hours per 1,000 bottles
- **Real value**: builds defense skills while creatures hit you, social activity in "sweat circles"
- **Honest take**: "Sweating will never make you rich" — it's a free starter activity, not a career

### Armor Mechanics
**9 damage types**: Impact, Cut, Stab, Burn, Cold, Acid, Electric, Penetration, Shrapnel [CONFIRMED — multiple sources]

**How protection works** [CONFIRMED — 2011 armor mechanics blog]:
1. Full damage offered to armor — absorbs what it can, decays accordingly
2. Full damage offered to plates — absorbs damage independently
3. Both reductions combined = actual damage taken
4. You can over-protect (wasteful decay) or under-protect (take more HP damage)

**Decay** (non-linear — higher damage = proportionally more decay):
- **Minimum decay** = sum of protection points / 100 (in PEC). E.g., 45 protection points = 0.45 PEC [CONFIRMED]
- Detailed decay formulas exist but are from 2011 — may have been adjusted since Loot 2.0. Treat as approximate

**Limited vs Unlimited armor** [CONFIRMED]:
- **Limited**: full protection until broken, ~16% more economical, but consumed permanently
- **Unlimited**: protection decreases as it decays (50% durability ≈ 50% protection), but repairable

**Creature-to-armor matching examples**:
- Cold: Feffoid, Feffox
- Acid: Leviathan, Aurli, Kretlin, Formicacida
- Electric: Steelbirds, Trilomite, Eviscerator

**Setesh armor**: 8-10 plates from missions, can't TT, CAN discard (fixed 19.0.2). ~17 PED TT total

### Skill System
- Skills increase through **active gameplay that costs PED** (hunting, mining, crafting) [CONFIRMED]
- **Logarithmic progression** — each point harder than the last, but worth more [CONFIRMED — EarnPED]
- **Professions** = combinations of multiple skills [CONFIRMED]. Example: Evader = Evade 25% + Athletics 14% + Combat Reflexes 11% + Courage 10% + Alertness 5% + Serendipity 5% + Avoidance 6% [CONFIRMED — EntropiaWiki]
- **Hidden skills**: unlock at certain profession levels; points aren't lost if profession drops [CONFIRMED]
- **SIB (Skill Increase Bonus)**: weapons within your skill range give bonus skill gains — always use SIB weapons
- Skills have real PED value — your avatar can be sold [CONFIRMED]
- **Codex**: kill-count tracker per creature type. Milestones grant skill rewards [CONFIRMED]

### Loot 2.0 System (How Loot Actually Works)
Based on official MindArk Developer Notes #11-14 [CONFIRMED]:
- Loot value is based primarily on **your costs** (ammo + weapon decay + armor decay + healing)
- **Efficiency only affects ~7% of total loot value** — not the huge factor people assume
- **Optimal Loot**: affects composition (what items you get), NOT total value. Lower cost-to-kill = more interesting loot composition
- **Overkill**: more damage than needed via crits = smaller individual loot events, BUT more kills per PED = more total loot events
- **No kill timer**: loot is based on costs, not speed
- **Key takeaway**: match gear to target. Don't overspend on gear for low-level mobs

### Navigation & Map
- **Open map**: press **M** [CONFIRMED]
- **Create waypoint**: right-click map > "Create Waypoint" > right-click to copy > paste in chat [CONFIRMED]
- **Set navigation target**: right-click location on map > "Set target location" = in-world marker [CONFIRMED]
- **Share your position**: type **/pos** in chat [CONFIRMED]
- **Set waypoint from coordinates**: type `/wp [Planet, Long, Lat, Height]` in chat, press enter [CONFIRMED]
- **Teleporters**: must physically visit each one to unlock. Then free fast-travel between unlocked TPs [CONFIRMED]

### Mentor System
- **How to register**: press **N** (Action Library) > search "Mentor Register" > click to request [CONFIRMED]
- **Mentor requirements**: account age 6+ months, profession level 15+ in any profession [CONFIRMED]
- **Graduation requires** [CONFIRMED — Entropia Codex]:
  - Kill + loot 1 creature in team with mentor
  - Mine 1 resource claim
  - Craft 1 item
  - Progress 3 skills: Anatomy, Geology, Engineering (any combination)
- **Disciple rewards** [CONFIRMED]:
  - Graduation armor (depends on planet at completion): Pixie Adjusted (Calypso/Monria), Musca Adjusted (Arkadia), Cyrene Disciple (Cyrene), Atlas (Next Island), Rifi ME (Toulan) — all ~35 protection points (Atlas has 36)
  - Explorer Mk. 1 (L) vehicle
- **Mentor rewards**: random "Mentors Edition" item (some have markup up to 10,000 PED) [CONFIRMED — multiple sources]
- **Tips for choosing a mentor**:
  - Ensure they speak your language
  - Check they play similar hours
  - Verify they're actually active

### Starter Packs (Optional Purchase — Not Required)
- **$10 Frontier Pack**: arguably best efficiency-rated weapons in the game for the price [CONFIRMED — Steam discussion]
- **$20 Frontier Pack**: better damage output, includes vehicle, repair tool, more ammo
- Neither is required — Setesh missions give you everything needed to start

### Inventory & UI Tips
- Meat from mobs is stackable but requires **manual stacking**
- Shrapnel, boxes, MM Stars fill inventory fast in non-stacking quantities
- Mission list gets cluttered (50-60+ missions) — no Setesh prefix to filter
- **Repair terminal**: use carefully with Vivo S10 (untradeable, repairs beyond what you received it at)
- Shops marked "OPEN" in Port Cabrakan are non-functional (decorative)
- Walking AI NPCs are decorative only

### General Tips from Veterans
- "Being really good at one thing is better than being mediocre at a lot of them" — specialize early
- Pay attention to loot patterns as you hunt
- Keep records of profitable hunting locations
- Use EntropiaWiki to compare item stats before buying
- Join a society ASAP — social connections are the #1 accelerator
- Budget for fluctuations in the loot cycle — don't panic on a bad run

---

## Leaving Setesh — What to Expect

- Use terminal near Trading Post to skip tutorial, VTOL to Camp Icarus
- Land at **Port Atlantis** on Calypso (redesigned in VU 19.2.0 as Setesh exit point)
- **First steps on Calypso**:
  1. Unlock the Port Atlantis teleporter immediately
  2. Find the sweat camp just over the hill
  3. Accept "Iron Puny Creatures" at the Hunting Challenge Terminal
  4. Join a Society for mentoring and help
  5. Register as a disciple if you haven't already (press N)
- **Warning**: Calypso uses **non-shared loot** (unlike Setesh). Expect competition
- **Warning**: Space between Setesh and Calypso has **lootable PvP zones**. Don't carry valuables
- Non-PVP zone established around Setesh Space Station (as of VU 19.0.2)

---

## Creatures

**Low-Level (1-3):**
| Creature | Notes |
|---|---|
| Sickly Exas | Starter mob |
| Derpis | Swarms are dangerous — don't pull multiples |
| Pupugi | Sparse spawns |
| Tezlapod | Electric attack, very fast, aggressive. NOT tamable on Setesh. Named after Nikola Tesla |
| Spina Larva | Has codex entries. Bug: rank completion may not grant expected META increase |

**High-Level:**
| Creature | Level |
|---|---|
| Young Set Atrox | 35 |
| Mature Set Atrox | 45 |
| Old Set Atrox | 52 |
| Provisional Set Atrox | 60 |
| Young Set Altaik | 82 |
| Material Set Altaik | 88 |
| Estophyls | Unknown |
| Drones | Robot-type |
| Robot Commando | New creature (VU 19.0.0) |

**Loot mechanics**:
- All mobs use **shared loot** (no kill-stealing) [CONFIRMED — multiple sources]
- Primary drops: shrapnel, residue, animal oil
- All creatures count toward Codex progression
- Bug: Commando Challenge codex doesn't increase META on Setesh

---

## Key Locations & Coordinates

| Location | Purpose | Coordinates |
|---|---|---|
| Port Cabrakan | Main hub, mission NPCs, trading | — |
| Camp Icarus | Secondary hub, Trader Joanna dailies | — |
| Outpost Bacab | Outpost (performance issues noted) | — |
| Outpost Hunraqan | Mining tutorial (NPC: Specialist Mel) | — |
| Iron Stronghold | Target Holo training | — |
| Robot Base | Mini-boss encounter | — |
| Camp entrance | — | [68007, 69611] |
| Robot Base entrance | — | [68026, 69510] |
| Robot Base TP | Malfunctioning | [68000, 69415] |
| Atrox Mining Rig | — | [66858, 71198] |
| Platform in lake | — | [68153, 70263] |
| Revive Point | — | [67032, 66963] |

---

## Known Issues (as of VU 19.5.0)

- Port Cabrakan: severe FPS drops reported, heavy VRAM usage [CONFIRMED — MindArk acknowledged, working on it]
- Mobs spawn stuck in rocks/trees (unkillable) [CONFIRMED — multiple reports]
- Mindforce implant may require relog to function [CONFIRMED — feedback thread]
- Commando Challenge codex doesn't increase META on Setesh [CONFIRMED — feedback thread]
- Can get stuck under hangar platform floor at Cabrakan [CONFIRMED — VU 19.0.2 known issues]
- "A Helping Hand" auto-crafter bug [CONFIRMED — multiple reports]
- Hover bike can't be repaired at 0 TT [CONFIRMED — WIP review]

---

## Community Resources

- **Ripcraze.com** — Interactive Setesh map with creature locations, missions, daily timers
- **Entropia Nexus** — Setesh map, item database, mission database
- **EntropiaWiki** — Weapon stats, creature data, tier information
- **@bambideatth on YouTube** — Setesh community events and streams
- **Planet Calypso Forum** — Community mob map v1.2, feedback threads

---

## Sources & Verification

All claims traced to origin. Items marked [CONFIRMED] have 2+ independent sources or official documentation. Items marked [UNCONFIRMED] have a single community source only.

- Planet Calypso Forum: Setesh feedback thread (p1-3), mob map, WIP review, DPP thread, expansion proposal, Target Holo thread, Setesh Initiative, auction fee thread
- Official release notes: VU 19.0.0, 19.0.1, 19.0.2, 19.0.3, 19.2.0, 19.5.0
- Ripcraze.com, Entropia Nexus, EntropiaWiki
- MMORPG.com, MindArk press release (Cision), TradingView
- EarnPED: sweating guide, skills guide
- Entropia Codex: mentor program, entry-level hunting, disciple graduation armor
- Explore Entropia: tips & tricks
- Entropia Universe Disciples: map & waypoints
- Armor mechanics blog (2011): entropia-universe-mmorpg.blogspot.com
- Loot 2.0: MindArk Developer Notes #11, #12, #13, #14
- Steam community: starter pack discussion
- EntropiaGO: current sweat pricing
- Wikipedia: Entropia Universe economy
