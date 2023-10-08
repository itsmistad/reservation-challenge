# `reservation-challenge`

An example solution for the front-end "Reservation" challenge.

> Providers have a schedule where they are available to see clients. Clients want to book time, in advance, on that schedule.
>
> Build the front end for a mobile web application that covers the following:
>
> -   Allows providers to submit times they’d like to work on the schedule.
> -   Allows clients to list available slots.
> -   Allows clients to reserve an available slot.
> -   Allows clients to confirm their reservation.

## 🏃‍♂️ Getting Started

### 🚧 Setup

Simple! Just install the project's dependencies:

```bash
yarn
```

### 🚥 Running

Runs the app in the development mode:

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## 🛠️ Development

### 🔍 Validation

Validates the project with ESLint and Prettier:

```bash
yarn lint
```

Alternatively, you can potentially auto-fix any outstanding issues with `yarn lint:fix`.

### 🧪 Testing

Launches the test runner in the interactive watch mode:

```bash
yarn test
```

### 🏗️ Building

Builds the app for production to the `build` folder:

```bash
yarn build
```

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## 🤔 Reflections

There are many things I opted out of for the sake of time:

1. React Native — setup and testing would take up the majority of the time.
2. Next.js — the focus of the challenge doesn't necessarily warrant the useful (though heavy) route/screen handling that Next provides.
3. Apollo/GraphQL integration _with_ interception, caching, or response mocking — would be amazing to use this here due to the ability to plug-and-play a _real_ API, but this isn't feasible in the limited time frame.
4. Jotai — data management with Jotai feels a lot more lightweight than Redux or React Contexts.
