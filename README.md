# Savora

**Savor every moment.**

Savora is a contemporary restaurant concept centered on fresh food, welcoming hospitality, and the pleasure of sharing a meal. It brings together familiar favorites and seasonal inspiration in a setting where guests can slow down, enjoy good company, and discover something delicious.

Whether you are stopping by for lunch, meeting friends for dinner, or planning a special occasion, Savora offers a place to feel comfortable and enjoy the moment. Our approach is simple: thoughtful dishes, balanced flavors, and a warm welcome at every table.

## Our Story

Savora begins with the idea that a good meal can turn an ordinary day into a memorable experience. Food gives people a reason to gather, exchange stories, celebrate milestones, and spend time together.

That idea shapes the restaurant's character. Rather than focusing on a single type of occasion, Savora welcomes both everyday visits and meaningful celebrations. A quick meal, an unhurried evening, and a family gathering all deserve the same care and attention.

## Our Food

Our menu brings together a variety of starters, main dishes, and desserts. It combines comforting recipes with fresh ingredients and contrasting textures, offering choices for different tastes and appetites.

### Starters

The meal begins with dishes that can be enjoyed individually or shared around the table. Roasted tomato soup offers a warm, comforting introduction, while crispy calamari adds a light crunch with lemon and herb aioli. Burrata toast pairs creamy cheese with tomatoes and basil, and house olives bring citrus, garlic, and rosemary to the table.

### Main Dishes

The main menu includes poultry, seafood, slow-cooked meat, and vegetable-based options. Herb-roasted chicken is served with seasonal vegetables and creamy mashed potatoes, while pan-seared salmon is paired with lemon butter, rice pilaf, and grilled asparagus.

For a richer meal, slow-braised beef short rib offers tender meat with roasted carrots and mashed potatoes. Mushroom risotto, chicken pesto pasta, and roasted cauliflower steak provide further choices, each with its own combination of herbs, textures, and flavors.

### Desserts

Dessert is an invitation to linger a little longer. A warm chocolate brownie with vanilla ice cream offers a rich finish, while New York cheesecake combines a creamy filling with a buttery biscuit base and berry sauce. A seasonal fruit tart brings a lighter, fruit-filled option, and tiramisu layers espresso, mascarpone, and cocoa.

## The Savora Atmosphere

Savora is imagined as a calm, contemporary space with a welcoming personality. A palette of deep navy, fresh mint, and light neutral tones gives the restaurant a distinct identity, balancing an elegant appearance with an approachable feel.

The atmosphere is intended to suit different moments throughout the day: a relaxed lunch, a conversation over dinner, or a celebration with the people who matter. Food remains at the center of the experience, supported by comfortable surroundings and attentive hospitality.

## Gather Around the Table

Some of the best memories begin with a shared meal. Savora welcomes friends catching up, families spending time together, couples enjoying an evening out, and guests simply treating themselves to a good plate of food.

Our varied menu makes it easy for everyone at the table to find something appealing. Guests can start with a few dishes to share, choose a main course that suits their appetite, and finish with dessert and conversation.

## Plan Your Visit

Explore the menu to discover the dishes, descriptions, and prices before your visit. The restaurant's visit section provides location information and opening hours to help you plan your time with us.

For a planned gathering, have your preferred date, time, and number of guests ready when arranging a table. Whether the occasion is casual or special, Savora aims to make the experience feel welcoming from the first moment to the last bite.

## Our Philosophy

Savora stands for food prepared with care, hospitality that feels personal, and time well spent around the table. We believe that the details matter: the balance of a dish, the welcome a guest receives, and the comfort of enjoying a meal without feeling rushed.

Our goal is to create a restaurant experience people look forward to returning to, where familiar favorites and new discoveries sit side by side.

**Fresh flavors. Warm welcomes. Memorable moments.**

## Check for horizontal scrolling

Run `npm.cmd run dev`, open the Vite URL, then open browser DevTools and enable the device toolbar. Choose a viewport width and paste the contents of `scripts/check-horizontal-scroll.js` into the Console. It reports PASS or the elements extending beyond the viewport. No extra libraries are required.

Check narrow screens and both sides of each breakpoint: 240, 280, 320, 375, 639, 640, 767, 768, 1023, 1024, 1440, and 1920 pixels. Repeat with each menu filter and after changing a quantity. A passing result covers the viewport and state tested, rather than guaranteeing every possible screen size.


## Run the client and server

- `client/`: the existing React + Tailwind website, components, images, and menu data.
- `server/`: the Express backend. Its health route is `GET /api/health`.
- The root package uses npm workspaces to install both apps with `npm.cmd install`.

Use two terminals from the repository root:

1. `npm.cmd run dev` starts the React client.
2. `npm.cmd run dev:server` starts Express on port 3001.

`npm.cmd run build` builds the client into `client/dist`.
