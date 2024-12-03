## Create a Turborepo with NextJs & Tailwindcss & Shadcn
https://matinkhani.medium.com/create-a-turborepo-with-nextjs-tailwindcss-shadcn-6e6ecfd52aea


## How to Add a Dependency to a Specific Package
To add a dependency to a specific workspace, such as adding axios to the Web App, follow these steps. Similar to running scripts, you can use the filter flag to specify the workspace where you want to add the dependency:

pnpm:
``` 
pnpm --filter web add -D axios
```
npm: 
```
npm install axios -D -w web
```
Yarn: 
```
yarn workspace web add --dev axios
```
Replace web with the name of your target workspace as needed.