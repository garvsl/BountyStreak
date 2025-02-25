# Bounty Streak
Save the seven seas and grow yer own digital pirate pet by tracking your recyclables one at a time! Each disposable you scan & recycle through our app gives you pet growth, doubloons, and real impact!!

## Inspiration
Research has found that less than a _third_ of young adults recycle on a regular basis! This alarming statistic prompted us to create Bounty Streak—an app that makes recycling way more fun by letting you scan every disposable you recycle via phone camera and and automatically granting you progress towards growing your very own digital **pirate pet**! Bounty Streak is specially designed to keep you engaged and incentivized to recycle by _gamifying_ the process using streaks, doubloons, quests and much more—letting you save the seven seas one recyclable at a time. Additional research from Harvard has shown that gamification can increase retention and engagement by **48%**!

## What it does
Bounty Streak is a fully-functional mobile app that allows you to use your phone camera to scan & track every item that is a valid recyclable (which we detect and accurately identify using computer vision via Google Generative AI). Each valid recyclable you scan with our app grants you progress points towards your digital pirate pet's growth (less microplastics in the environment = more growth!) & our in-app quests which upon completion reward you with doubloons. These doubloons can be used to buy digital pet cosmetics in our in-app shop. And to keep you accountable, we have a streak system that tracks how many days you're consistently recycling—so miss a day and that streak is gone!

Been recycling a lot? We reward that too! We have a quest system that automatically tracks how many items you've recycled based on the category (plastics, glass, etc) and upon completion of some quests we even _plant a tree in your honor_. So not only are you doing your part, but so are we!

## How we built it
We built Bounty Streak as a mobile app using React Native, Expo, TypeScript for our frontend and Firebase as our backend for data management and user sign-in/authentication. Our design goal was to create a user-friendly and clean app that has everything you need at the tap of the screen. Our app comes with 5 main pages + additional pages for settings and signup/login. Users can create an account upon launching the app on our sign up page and will be immediately brought to our home page. 

**Home Page:** This page consists information like your current streak, the amount of doubloons you have, a quick glance towards your quests progress, and how much time you have left to recycle for the day.
**Recyclable Scanner:**: This is where you can track every item you want to recycle through our app by using your phone camera to take pictures of the disposables. Our app utilizes computer vision + _Google Generative AI_ to accurately identify exactly what disposable you are trying to recycle and assigning it to a category such as plastics, cardboard, glass, etc. Upon successful scanning, we increment your digital pet growth & quest progress.
**Your Pirate Pet:** Keep track of your digital pet's growth and cosmetic!
**Shop:** Buy cosmetics and further items here for your pirate pet.
**Leaderboard:**: Displays the top users based on amount of doubloons earned.

## Challenges we ran into
We ran into challenges with our backend in Firebase to ensure all the data was in the best format for our app's needs. This definitely caused us to do a lot of trial and error, and even more trial and error when trying to programmatically fetch exactly what data we needed without error because of nesting and the NoSQL format. On the frontend, we had challenges with project configuration and ensuring each page was seamless and responsive while pulling data from our backend. Implementing pet growth and cosmetics also proved to be a challenge because of creating each pet + cosmetic sprite and keeping it in sync with the user.

## Accomplishments that we're proud of
We're proud that we were able to make a fully functional mobile app in React Native that is equipped with computer vision to track recyclables! We're also proud we were able to successfully implement a digital pet and cosmetics that keeps you coming back to the app to continue your quest of saving the seven seas through recycling. It was a lot of fun to learn + use this tech stack for HopperHacks.

## What we learned
Learned how to effectively use Google Generative AI in a React Native app, implement a multitude of backend/Firebase functions to efficiently work with our data, best practices for data modeling, more mobile app dev experience, and finally app design principles.

## What's next for Bounty Streak
In the future we plan to expand this app further by partnering with environment-focused charities around the world and implement quests where upon completion instead of granting doubloons, Bounty Streak will donate to a (partnered) charity of the user's choice on their behalf. Additionally, we want to expand the user base of this app and potentially partner with schools as well to teach positive recycling habits from a young age because of our built-in gamification elements.

## Contributions
- Garv Sehgal - Frontend
- Alex Snit - Frontend
- Tasnim Ferdous - Backend
- Irvin Lin - Backend
