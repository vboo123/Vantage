# Product Requirements Document (PRD)

## Vision
One stop shop at my app. Anyone shopping won’t need to go to different sites, look at different stores etc. they can rely on me to use the latest greatest models, techs prompts.

## Mission
To empower shoppers with AI-driven intelligence, cutting through the noise to find the best personalized deals and optimize the shopping experience.

## Problem
When I was going to Camarillo with my family for Black Friday Shopping, my mom asked me to find which store (H&M, Pacsun, Hollister, etc) have the better overall deals for the items we want (nice jeans, joggers etc). I tried google searching for our outlet mall’s specific deals to try and compare, and no results were showing up. I even tried searching store by store but couldn’t find the specific outlet mall’s deals for that store (like for Pacsun).

Then, my dad driving in the front seat mentioned there is a website that has all the deals and information for all the outlet stores in Camarillo Outlet malls. We logged into that and then were able to manually go through and see the deals.

The issue goes down several layers:
1. One is that I didn’t even know that website even existed. I was spinning in circles trying to find the outlet mall specific deals, and had my dad not spoken up, i would have just given up.
2. Second, even after logging in, I had to manually go through and compare the deals, which was annoying and lots of overhead.
3. Thirdly, that didn’t even show the deals for what items they apply to. Like in Pacsun, they had different deals for denim vs for joggers vs for women’s clothing.

What I would like to do is make a shopping plan based on my preferences and create a path of what stores I want to visit and “ideally” what items I’d want to buy based off the available deals.

## Solution
*Features or problems I would like the app to solve. I don’t think I’d be focusing on implementing all of these in MVP, but I want to document everything I am thinking once*

1. **Deal Source Aggregation**: Based on some mall location, the tool should be able to find all the sources where accurate deals are posted. This includes any private mall specific websites that require account creation and login. This allows people who are new to the area or who don’t know about these things before reaching to the mall to have access.
2. **Detailed Comparison**: The app should be able to provide detailed information on all the deals available for select stores, and provide a comparison option to allow users to figure out which stores give them more bang for your buck.
3. **Item-Specific Recommendations**: Users should be able to select the items they want to shop for in the app and the stores recommended for certain items are automatically created via the app. For example, if I want to buy a quarter zip, black jeans, boots, etc on Black Friday shopping, it will tell me where to get those items based off item-specific deals from different stores.

## Existing Solutions & Gaps

| **Your Proposed Feature** | **Current App Landscape** | **The Gap (What's Missing)** |
| --- | --- | --- |
| **1. Find All Deal Sources (Including Private Mall Sites)** | **Flipp** and **Black Friday Apps** aggregate many store flyers and general Black Friday deals. | **The Gap:** No app actively scrapes and utilizes the **private, login-required deal pages** for specific outlet mall management companies to consolidate *mall-specific* savings. They rely on publicly advertised deals. |
| **2. Detailed Item-Specific Deal Comparison & Recommendation** | **ShopSavvy**, **BuyVia**, and **Google Shopping** compare prices for a *specific item* (often by barcode) across *many retailers*. | **The Gap:** No app lets you input a **generic category** (e.g., "Black Jeans") and then returns a ranked list of store deals that apply to that category. This requires interpreting the deal's *terms*. |
| **3. Shopping Path Creation/Optimization** | **Google Maps** can route you through a mall, and some store apps offer in-store maps. | **The Gap:** No app links the **best deal ranking** to a **store map** for a specific mall location to create an **optimized walking path** based on the items you want to buy. |

## Brain Dump / Market Research Notes
- **Partnering**: Why would stores partner? Affiliate programs, driving traffic.
- **Data Acquisition**: Web scraping, partnering with corporate/franchises.
- **Online Wrapper**: Create a wrapper around LLMs (Gemini, ChatGPT, Claude) to identify brands and deals, providing a non-biased result.
- **Social Integration**: Future feature to integrate with social media for "shopping together".
- **Real-time Aggregation**: Aggregate emails and texts for deals (Personalized Deal Manager).
