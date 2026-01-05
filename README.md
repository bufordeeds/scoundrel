# Scoundrel

A mobile card game adaptation of the solitaire dungeon crawler by Zach Gage and Kurt Bieg.

## About

Navigate through a dungeon deck, fighting monsters, collecting weapons, and drinking potions to survive. Every decision matters in this roguelike card game where one wrong move means death.

## How to Play

- **Deal a Room**: 4 cards are dealt face-up
- **Face the Room**: Interact with exactly 3 cards, leaving 1 for the next room
- **Or Avoid**: Send all cards to the bottom of the deck (can't avoid twice in a row)

### Card Types

| Card | Suit | Action |
|------|------|--------|
| Monster | ♠ ♣ | Fight barehanded (full damage) or with weapon (reduced damage) |
| Weapon | ♦ | Equip to reduce monster damage. Replaces current weapon. |
| Potion | ♥ | Heal by card value (max 20 HP). Only 1 heals per room. |

### Weapon Degradation

After killing a monster with a weapon, it can only kill monsters with **lower value** than the last kill. Choose your targets wisely!

### Scoring

- **Death**: Negative sum of remaining monsters in deck
- **Survival**: Your remaining HP
- **Perfect**: 20 HP + last card was a potion = bonus points!

## Tech Stack

- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **State**: Zustand
- **Backend**: Supabase (leaderboard)
- **Navigation**: Expo Router

## Development

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

## Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS (TestFlight)
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios
```

## Credits

- Original game design: [Zach Gage](http://stfj.net/) & Kurt Bieg
- [Official Rules](http://www.stfj.net/art/2011/Scoundrel.pdf)

## License

This is a fan-made digital adaptation for personal/educational use.
