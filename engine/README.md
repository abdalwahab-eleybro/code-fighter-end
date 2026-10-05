# Code Fighter Engine

## Architecture Overview

This is a modular redesign of the Code Fighter project, organized as an engine for easy modification, reuse, and content changes.

### Folder Structure

```
engine/
├── index.html                    # Main entry point
├── README.md                     # This file
├── css/
│   ├── styles.css                # Main CSS styles
│   ├── components/
│   │   ├── buttons.css           # Button styles
│   │   ├── cards.css             # Card styles
│   │   ├── arena.css             # Arena/fight styles
│   │   ├── visualizer.css        # Learning lab visualizer styles
│   │   └── responsive.css         # Responsive design styles
│   └── themes/
│       └── dark.css              # Dark theme variables
├── js/
│   ├── main.js                   # Main entry point - initializes everything
│   ├── modules/
│   │   ├── state.js              # State management (profile, session)
│   │   ├── campaign.js            # Campaign data and logic
│   │   ├── questions.js           # Question bank and logic
│   │   ├── fight.js               # Fight/arena logic
│   │   ├── shop.js                # Shop functionality
│   │   ├── settings.js            # Settings management
│   │   ├── blitz.js               # Blitz mode logic
│   │   ├── learn.js               # Learning lab logic
│   │   └── audio.js               # Audio management
│   ├── data/
│   │   ├── campaign-data.js       # Campaign level definitions
│   │   ├── questions-bank.js      # Question database
│   │   ├── fighters.js            # Fighter definitions
│   │   ├── patterns.js            # Pattern definitions
│   │   └── achievements.js        # Achievement definitions
│   └── ui/
│       ├── navigation.js         # Screen navigation
│       ├── profile-bar.js        # Profile bar rendering
│       ├── map-ui.js              # Map screen UI
│       ├── fight-ui.js            # Fight screen UI
│       ├── recap-ui.js            # Recap screen UI
│       ├── shop-ui.js             # Shop screen UI
│       ├── settings-ui.js          # Settings screen UI
│       ├── learn-ui.js            # Learn screen UI
│       └── components.js          # Reusable UI components
├── templates/
│   ├── menu.html                 # Menu screen template
│   ├── map.html                  # Map screen template
│   ├── fight.html                # Fight screen template
│   ├── shop.html                 # Shop screen template
│   ├── settings.html             # Settings screen template
│   ├── recap.html                # Recap screen template
│   └── learn.html                 # Learn screen template
└── assets/
    └── (empty - for future assets)
```

### Key Design Principles

1. **Separation of Concerns**: Each file has a single responsibility
2. **Modularity**: Components can be easily swapped or modified
3. **Data-Driven**: Content is separated from logic
4. **Reusable**: Common patterns are extracted into reusable modules
5. **Extensible**: Easy to add new content without modifying core logic

### How to Add New Content

#### Adding a New Level
1. Add level definition to `data/campaign-data.js`
2. Add questions to `data/questions-bank.js`
3. No changes to core logic needed

#### Adding a New Question Type
1. Add type definition to `modules/questions.js`
2. Create UI component in `ui/components.js`
3. Add rendering logic

#### Adding a New Fighter
1. Add fighter definition to `data/fighters.js`
2. Update unlock conditions in `modules/state.js`

### Dependencies

The engine uses pure JavaScript with no external dependencies. All state is managed internally.

### Building

The project can be used directly by opening `index.html` in a browser. For production, consider:
- Minifying CSS and JS
- Bundling with a tool like Webpack or Vite
- Adding a build script

### Development Tips

1. Use `console.log` liberally for debugging
2. Test changes in a single screen before integrating
3. Keep data files clean and well-commented
4. Follow existing naming conventions
5. Use descriptive variable names

## File Descriptions

### CSS Files
- `css/styles.css`: Main stylesheet with CSS variables
- `css/components/*.css`: Component-specific styles
- `css/themes/*.css`: Theme definitions
- `css/responsive.css`: Responsive design rules

### JavaScript Files

#### Modules (`js/modules/`)
- `state.js`: Manages game state, profile, save/load
- `campaign.js`: Campaign progression, level management
- `questions.js`: Question selection, validation, scoring
- `fight.js`: Combat logic, damage calculation, animations
- `shop.js`: Shop items, purchases, upgrades
- `settings.js`: Settings management, audio controls
- `blitz.js`: Blitz mode specific logic
- `learn.js`: Learning lab functionality
- `audio.js`: Sound effects and music

#### Data (`js/data/`)
- `campaign-data.js`: Level definitions, patterns, tiers
- `questions-bank.js`: All questions organized by pattern and difficulty
- `fighters.js`: Fighter definitions and unlock conditions
- `patterns.js`: Pattern metadata and descriptions
- `achievements.js`: Achievement definitions and triggers

#### UI (`js/ui/`)
- `navigation.js`: Screen switching, history management
- `profile-bar.js`: Profile bar rendering and updates
- `map-ui.js`: Map screen rendering
- `fight-ui.js`: Fight screen rendering and interactions
- `recap-ui.js`: Recap screen rendering
- `shop-ui.js`: Shop screen rendering
- `settings-ui.js`: Settings screen rendering
- `learn-ui.js`: Learning lab UI
- `components.js`: Reusable UI components (buttons, cards, etc.)

### Templates
Each HTML template contains the static structure for a screen. Dynamic content is injected by JavaScript modules.
