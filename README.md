# 📚 React Native Library Template

This repository is an optimized React Native library boilerplate, designed to boost your library development process.🧑‍💻🔧 It's tailored for both bare React Native applications and Expo-created ones. This boilerplate is equipped with valuable tools, simplifying library development and ensuring high-quality code.

## 🌟 Features

- Enforces code style with eslint, prettier, and TypeScript,
- Precommit hooks checking code style and type issues,
- GitHub Actions to aid in your development process,
- Automated library deployments to npm and hassle-free versioning thanks to [_semantic-release_](https://github.com/semantic-release/semantic-release),
- Provides an example app for both bare React Native projects and Expo-managed ones,
- `jest` setup is also available with example tests

## 📋 Requirements

Node 18 or greater is required. Development for iOS needs a Mac and Xcode.

## 🚀 Quick Start

To create a fresh project, just run:

```sh
npx rn-lib-temp init <projectName>
```

Before starting development, go to the directory where you created the template project and install all necessary dependencies with `yarn`:

```sh
yarn
```

**For iOS only**: Install required Pods for the bare React Native example app:

```sh
yarn example:bare pod
```

### Getting help

For more details about the `npx rn-lib-temp` command use the following command:

```sh
npx rn-lib-temp help
```

## 💫 GitHub Actions

To use the GitHub Actions bundled with this boilerplate, you'll need to provide 2 secrets (refer to [this](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) page for more about secrets):

- `GH_TOKEN` - a GitHub token with `repo` permissions (check [docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) for more on GitHub access tokens).
- `NPM_TOKEN` - an npm token employed by [_semantic-release_](https://github.com/semantic-release/semantic-release) for automatic library deployment (see [docs](https://docs.npmjs.com/about-access-tokens) for info on npm access tokens).

Alternatively, remove workflows from the `.github` directory if you prefer not to use GitHub Actions.

## 🛠️ Library Development

### 🏗️ Project Structure

he repository uses the most common monorepo structure where the `example` directory contains the example app and the `packages` directory contains sources of the library itself, as well as, documentation and other packages (if necessary).

#### Library Source Files

By default, the resulting library will include files specified under the `files` key in the `packages/<your-library-name>/package.json`:

- `src` directory - where you write all library source code,
- `dist` directory - generated by **react-native-builder-bob** during the build process,
- `LICENSE` - you should include your `LICENSE` file because it's not provided by default,
- `CHANGELOG.md` - a file containing all version history with included changes, automatically generated by the **semantic-release** library,
- `README.md` - readme file from the repository root directory

#### Library Dependencies

##### Included in the library

- Usually for smaller dependencies or these which must point to the exact version,
- Should be listed under `dependencies` field in the `packages/<your-library-name>/package.json`

##### Dependencies that must be installed by the user

- Usually large dependencies or these, which are commonly used by other packages (such as `react-native-reanimated`),
- Should be listed under `peerDependencies` field in the `packages/<your-library-name>/package.json`,
- Should be installed as `dependencies` of the example app (added to the `example/app/package.json`)

All dependencies should be installed with `yarn` in order to ensure that yarn workspaces work properly.

### 📱 Example App

The example app is located in the `example` directory. Inside, you'll find three subdirectories:

- `app` - Where the example app source code is located
- `fabric` - Sources necessary to run the bare React Native app on Fabric (the New Architecture)
- `paper` - Sources necessary to run the paper React Native app on Paper (the Old Architecture)
- `expo` - Sources of the expo-managed app

If you don't need to include **expo** or **fabric**/**paper** React Native app example, you can just remove the corresponding directory.

#### Useful Commands

For launching the bare React Native example app:

```sh
yarn example:bare start|android|ios|pod
```

For the Expo React Native app:

```sh
yarn example:expo start|android|ios
```

- `start` - starts metro client
- `android` - starts example app on the Android emulator/device,
- `ios` - starts example app on the iOS simulator/device,
- `pod` - installs Pods required by example app native iOS dependencies.

### 🔄 Automatic deployments

The `release.yaml` workflow included in the project contains the auto deployment logic. By default, the deployment will be caused on the **workflow dispatch** action (manually from the GitHub Actions page). You can change this behavior by modifying the workflow triggers.
