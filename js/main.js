var MyLifePlatformerGame = {}
var font

MyLifePlatformerGame.Params = {
  baseWidth: 960,
  baseHeight: 600,
  iconSize: 250,
  LEVEL_COUNT: 2
}

MyLifePlatformerGame._scaleSprite = function (sprite, maintainAspectRatio) {
  var scale = this._getSpriteScale(sprite)
  if (maintainAspectRatio) {
    var maxRatio = Math.max(scale.x, scale.y)
    sprite.scale.setTo(maxRatio, maxRatio)
  } else {
    sprite.scale.setTo(scale.x, scale.y)
  }
}

MyLifePlatformerGame._getSpriteScale = function (sprite) {
  // Sprite needs to fit in either width or height
  var widthRatio = sprite.game.canvas.width / MyLifePlatformerGame.Params.baseWidth
  var heightRatio = sprite.game.canvas.height / MyLifePlatformerGame.Params.baseHeight

  return {x: widthRatio, y: heightRatio}
}

MyLifePlatformerGame.Boot = function (game) {}

MyLifePlatformerGame.Boot.prototype = {
  init: function () {
    this.scale.scaleMode = Phaser.ScaleManager.RESIZE
  },
  preload: function () {
    this.load.image('loading', 'images/loading.png')
  },
  create: function () {
    this.state.start('Loading')
  }
}

MyLifePlatformerGame.Loading = function (game) {}

MyLifePlatformerGame.Loading.prototype = {
  init: function () {},
  preload: function () {
    this.stage.backgroundColor = 0x222222
    var loadingBar = this.add.sprite(this.world.centerX, this.world.centerY, 'loading')
    loadingBar.anchor.setTo(0.5)
    this.load.setPreloadSprite(loadingBar)

    this.load.image('gametitle', 'images/gametitle.png')
    this.load.image('onePlayerGame', 'images/one_player_game.png')
    this.load.spritesheet('settings', 'images/sheet_black2x.png', 25, 25)
    this.load.image('welcomeBackground', 'images/welcomeBackground.png')
  },
  create: function () {
    this.state.start('GameTitle')
  }
}

MyLifePlatformerGame.MainMenu = function (game) {
}

MyLifePlatformerGame.MainMenu.prototype = {
  create: function () {
    this.background = this.add.image(0, 0, 'welcomeBackground')
    MyLifePlatformerGame._scaleSprite(this.background, true)

    this.title = this.game.add.image(this.world.centerX, this.world.centerY - this.game.height / 5, 'gametitle')
    this.title.anchor.setTo(0.5)
    MyLifePlatformerGame._scaleSprite(this.title)

    this.playButton = this.game.add.button(this.world.centerX, this.world.centerY + this.game.height / 5, 'onePlayerGame', this.playMyLifePlatformerGame, this)
    this.playButton.anchor.setTo(0.5)
    this.playButton.clicked = false

    this.infoButton = this.game.add.button(this.world.centerX - MyLifePlatformerGame.Params.iconSize / 2, this.world.centerY + this.game.height / 3, 'settings', this.viewGameHelp, this)
    this.infoButton.anchor.setTo(0.5)
    this.infoButton.frame = 9
    this.infoButton.clicked = false
    MyLifePlatformerGame._scaleSprite(this.infoButton, true)
    this.infoButton.x = this.world.centerX - this.infoButton.width / 2

    this.audioButton = this.game.add.button(this.world.centerX + MyLifePlatformerGame.Params.iconSize / 2, this.world.centerY + this.game.height / 3, 'settings', this.setAudio, this)
    this.audioButton.anchor.setTo(0.5)
    this.audioButton.frame = 5
    this.audioButton.clicked = false
    MyLifePlatformerGame._scaleSprite(this.audioButton, true)
    this.audioButton.x = this.world.centerX + this.infoButton.width / 2
  },

  resize: function (width, height) {
    this.background.height = height
    this.background.width = width

    MyLifePlatformerGame._scaleSprite(this.title)
    this.title.x = this.world.centerX
    this.title.y = this.world.centerY - height / 3

    MyLifePlatformerGame._scaleSprite(this.playButton)
    this.playButton.x = this.world.centerX
    this.playButton.y = this.world.centerY

    MyLifePlatformerGame._scaleSprite(this.infoButton)
    this.infoButton.x = this.world.centerX - this.infoButton.width / 2
    this.infoButton.y = this.world.centerY + height / 3

    MyLifePlatformerGame._scaleSprite(this.audioButton)
    this.audioButton.x = this.world.centerX + this.audioButton.width / 2
    this.audioButton.y = this.world.centerY + height / 3
  },
  playMyLifePlatformerGame: function (button) {
    if (!button.clicked) {
      button.clicked = true
      this.state.start('play', true, false, {level: 0})
    }
  },
  viewGameHelp: function (button) {
    if (!button.clicked) {
      button.clicked = true
    }
  },
  setAudio: function (button) {
    if (!button.clicked) {
      button.clicked = true
    }
  }
}

function Hero (game, x, y) {
  // call Phaser.Sprite constructor
  Phaser.Sprite.call(this, game, x, y, 'hero')
  this.anchor.set(0.5, 0.5)
  this.game.physics.enable(this)
  this.body.collideWorldBounds = true
  this.animations.add('stop', [0])
  this.animations.add('run', [1, 2], 8, true) // 8fps looped
  this.animations.add('jump', [3])
  this.animations.add('fall', [4])
  MyLifePlatformerGame._scaleSprite(this)
  // this.scale.setTo(scaleX(), scaleY())
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype)
Hero.prototype.constructor = Hero

Hero.prototype.move = function (direction) {
  const SPEED = 200
  this.body.velocity.x = direction * SPEED

  if (this.body.velocity.x < 0) {
    this.scale.x = -1 * scaleX()
  } else if (this.body.velocity.x > 0) {
    this.scale.x = 1 * scaleX()
  }
}

Hero.prototype.jump = function () {
  const JUMP_SPEED = 600
  let canJump = this.body.touching.down

  if (canJump) {
    this.body.velocity.y = -JUMP_SPEED
  }

  return canJump
}

Hero.prototype.bounce = function () {
  const BOUNCE_SPEED = 200
  this.body.velocity.y = -BOUNCE_SPEED
}

Hero.prototype._getAnimationName = function () {
  let name = 'stop' // default animation

  if (this.body.velocity.y < 0) {
    name = 'jump'
  } else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
    name = 'fall'
  } else if (this.body.velocity.x !== 0 && this.body.touching.down) {
    name = 'run'
  }

  return name
}

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
  let animationName = this._getAnimationName()
  if (this.animations.name !== animationName) {
    this.animations.play(animationName)
  }
}

function Spider (game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'spider')
  this.scale.setTo(scaleX(), scaleX())

    // anchor
  this.anchor.set(0.5)
    // animation
  this.animations.add('crawl', [0, 1, 2], 8, true)
  this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12)
  this.animations.play('crawl')
  this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12)

    // physic properties
  this.game.physics.enable(this)
  this.body.collideWorldBounds = true
  this.body.velocity.x = Spider.SPEED
}

Spider.SPEED = 100

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype)
Spider.prototype.constructor = Spider

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
  if (this.body.touching.right || this.body.blocked.right) {
    this.body.velocity.x = -Spider.SPEED // turn left
  } else if (this.body.touching.left || this.body.blocked.left) {
    this.body.velocity.x = Spider.SPEED // turn right
  }
}

Spider.prototype.die = function () {
  this.body.enable = false

  this.animations.play('die').onComplete.addOnce(function () {
    this.kill()
  }, this)
}

MyLifePlatformerGame.PlayState = function (game) {}

MyLifePlatformerGame.PlayState.prototype = {
  init: function (data) {
    this.game.renderer.renderSession.roundPixels = true
    this.keys = this.game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP
    })

    this.keys.up.onDown.add(function () {
      let didJump = this.hero.jump()
      if (didJump) {
        this.sfx.jump.play()
      }
    }, this)

    this.coinPickupCount = 0
    this.hasKey = false
    this.level = (data.level || 0) % MyLifePlatformerGame.Params.LEVEL_COUNT
  },
  preload: function () {
    this.game.load.json('level:0', 'data/level00.json')
    this.game.load.json('level:1', 'data/level01.json')
    this.game.load.image('background', 'images/background.png')
    this.game.load.image('welcomeBackground', 'images/welcomeBackground.png')
    this.game.load.image('ground', 'images/ground.png')
    this.game.load.image('grass:8x1', 'images/grass_8x1.png')
    this.game.load.image('grass:6x1', 'images/grass_6x1.png')
    this.game.load.image('grass:4x1', 'images/grass_4x1.png')
    this.game.load.image('grass:2x1', 'images/grass_2x1.png')
    this.game.load.image('grass:1x1', 'images/grass_1x1.png')
    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42)
    this.game.load.audio('sfx:jump', 'audio/jump.wav')
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22)
    this.game.load.audio('sfx:coin', 'audio/coin.wav')
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32)
    this.game.load.image('invisible-wall', 'images/invisible_wall.png')
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav')
    this.game.load.image('icon:coin', 'images/coin_icon.png')
    this.game.load.image('font:numbers', 'images/numbers.png')
    this.game.load.spritesheet('door', 'images/door.png', 42, 66)
    this.game.load.image('key', 'images/key.png')
    this.game.load.audio('sfx:key', 'audio/key.wav')
    this.game.load.audio('sfx:door', 'audio/door.wav')
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30)
    this.game.load.image('mathBook', 'images/genericItem_color_035.png')
    this.game.load.audio('sfx:badge', 'audio/badge.wav')
    this.game.load.image('mario', 'images/Super Mario Bros 3 (Nintendo).png')
  },
  create: function () {
    // create sound entities
    this.sfx = {
      jump: this.game.add.audio('sfx:jump'),
      coin: this.game.add.audio('sfx:coin'),
      stomp: this.game.add.audio('sfx:stomp'),
      key: this.game.add.audio('sfx:key'),
      door: this.game.add.audio('sfx:door'),
      badge: this.game.add.audio('sfx:badge')
    }
    this.background = this.game.add.image(0, 0, 'background')
    this.background.height = this.background.height * scaleY()
    this.background.width = this.background.width * scaleX()
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`))
    this._createHud()

    font = this.game.add.retroFont('mario', 8, 8, Phaser.RetroFont.TEXT_SET1)

    var i = this.game.add.image(this.game.world.centerX, 6 * 32, font)
    i.tint = Math.random() * 0xFFFFFF
    i.anchor.set(0.5, 1)
  },
  update: function () {
    this._handleCollisions()
    this._handleInput()
    this.coinFont.text = `x${this.coinPickupCount}`
    this.keyIcon.frame = this.hasKey ? 1 : 0
  },
  resize: function (width, height) {
    this.game.state.restart(true, true, {level: this.level})
  },
  _loadLevel: function (data) {
    this.bgDecoration = this.game.add.group()
    // create all the groups/layers that we need
    this.platforms = this.game.add.group()
    this.coins = this.game.add.group()
    this.spiders = this.game.add.group()
    this.enemyWalls = this.game.add.group()
    this.enemyWalls.visible = false
    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this)
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, coins: data.coins, spiders: data.spiders})
    // spawn important objects
    data.coins.forEach(this._spawnCoin, this)
    this._spawnDoor(data.door.x, data.door.y)
    this._spawnKey(data.key.x, data.key.y)
    this._spawnMathBook(data.mathBook.x, data.mathBook.y, data.mathBook.text)
    // enable gravity
    const GRAVITY = 1200 / scaleY(1)
    this.game.physics.arcade.gravity.y = GRAVITY
  },
  _spawnPlatform: function (platform) {
    let sprite = this.platforms.create(
      platform.x * scaleX(), platform.y * scaleY(), platform.image
    )
    sprite.scale.setTo(scaleX(), scaleY())
    this.game.physics.enable(sprite)
    sprite.body.allowGravity = false
    sprite.body.immovable = true
    this._spawnEnemyWall(platform.x * scaleX(), platform.y * scaleY(), 'left')
    this._spawnEnemyWall(platform.x * scaleX() + sprite.width, platform.y * scaleY(), 'right')
  },
  _spawnCharacters: function (data) {
    // spawn spiders
    data.spiders.forEach(function (spider) {
      let sprite = new Spider(this.game, spider.x * scaleX(), spider.y * scaleY())
      sprite.scale.setTo(scaleX(), scaleY())
      this.spiders.add(sprite)
    }, this)
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x * scaleX(), data.hero.y * scaleY())
    this.game.add.existing(this.hero)
  },
  _spawnCoin: function (coin) {
    let sprite = this.coins.create(coin.x * scaleX(), coin.y * scaleY(), 'coin')
    sprite.anchor.set(0.5, 0.5)
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true) // 6fps, looped
    sprite.animations.play('rotate')
    this.game.physics.enable(sprite)
    sprite.body.allowGravity = false
  },
  _spawnEnemyWall: function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall')
    sprite.scale.setTo(scaleX(), scaleY())
      // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1)

      // physic properties
    this.game.physics.enable(sprite)
    sprite.body.immovable = true
    sprite.body.allowGravity = false
  },
  _handleInput: function () {
    if (this.keys.left.isDown) { // move hero left
      this.hero.move(-1 * scaleX())
    } else if (this.keys.right.isDown) { // move hero right
      this.hero.move(1 * scaleX())
    } else { // stop
      this.hero.move(0)
    }
  },
  _handleCollisions: function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms)
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls)
    this.game.physics.arcade.collide(this.hero, this.platforms)
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
          null, this)
    this.game.physics.arcade.collide(this.spiders, this.platforms)
    this.game.physics.arcade.overlap(this.hero, this.spiders,
          this._onHeroVsEnemy, null, this)
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
                null, this)
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
                      // ignore if there is no key or the player is on air
                      function (hero, door) {
                        return this.hasKey && hero.body.touching.down
                      }, this)
    this.game.physics.arcade.overlap(this.hero, this.mathBook, this._onHeroVsBadge,
                            null, this)
  },
  _onHeroVsCoin: function (hero, coin) {
    this.sfx.coin.play()
    coin.kill()
    this.coinPickupCount++
  },
  _onHeroVsEnemy: function (hero, enemy) {
    if (hero.body.velocity.y > 0) {
      hero.bounce()
      // kill enemies when hero is falling
      enemy.die()
      this.sfx.stomp.play()
    } else {
      this.sfx.stomp.play()
      this.game.state.restart(true, false, {level: this.level})
    }
  },
  _onHeroVsDoor: function (hero, door) {
    this.sfx.door.play()
    this.game.state.restart(true, false, { level: this.level + 1 })
  },
  _createHud: function () {
    this.keyIcon = this.game.make.image(0, 19, 'icon:key')
    this.keyIcon.anchor.set(0, 0.5)

    const NUMBERS_STR = '0123456789X '
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
          NUMBERS_STR, 6)

    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin')
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
          coinIcon.height / 2, this.coinFont)
    coinScoreImg.anchor.set(0, 0.5)
    coinScoreImg.scale.setTo(scaleX(), scaleY())

    this.hud = this.game.add.group()
    this.hud.add(coinIcon)
    this.hud.position.set(10 * scaleX(), 10 * scaleY())
    this.hud.add(coinScoreImg)
    this.hud.add(this.keyIcon)
  },
  _spawnDoor: function (x, y) {
    this.door = this.bgDecoration.create(x * scaleX(), y * scaleY(), 'door')
    this.door.anchor.setTo(0.5, 1)
    this.door.scale.setTo(scaleX(), scaleY())
    this.game.physics.enable(this.door)
    this.door.body.allowGravity = false
  },
  _spawnKey: function (x, y) {
    this.key = this.bgDecoration.create(x * scaleX(), y * scaleY(), 'key')
    this.key.anchor.set(0.5, 0.5)
    this.game.physics.enable(this.key)
    this.key.body.allowGravity = false
    // add a small 'up & down' animation via a tween
    this.key.y -= 3
    this.game.add.tween(this.key)
          .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
          .yoyo(true)
          .loop()
          .start()
  },
  _spawnMathBook: function (x, y, text) {
    this.mathBook = this.bgDecoration.create(x * scaleX(), y * scaleY(), 'mathBook')
    this.mathBook.text = text
    this.mathBook.anchor.set(0.5, 0.5)
    this.mathBook.scale.setTo(0.5, 0.5)
    this.game.physics.enable(this.mathBook)
    this.mathBook.body.allowGravity = false

    // add a small 'up & down' animation via a tween
    this.mathBook.y -= 3
    this.game.add.tween(this.mathBook)
          .to({y: this.mathBook.y + 8}, 600, Phaser.Easing.Sinusoidal.InOut)
          .yoyo(true)
          .loop()
          .start()
  },
  _onHeroVsKey: function (hero, key) {
    this.sfx.key.play()
    key.kill()
    this.hasKey = true
  },
  _onHeroVsBadge: function (hero, mathBook) {
    this.sfx.badge.play()
    font.text = mathBook.text
    window.setTimeout(clearMessage, 4000)
    mathBook.kill()
  }
}

function clearMessage () {
  font.text = ''
}

function scaleX () {
  return window.innerWidth / MyLifePlatformerGame.Params.baseWidth
}

function scaleY () {
  return window.innerHeight / MyLifePlatformerGame.Params.baseHeight
}

window.onload = function () {
  let game = new Phaser.Game(MyLifePlatformerGame.Params.baseWidth, MyLifePlatformerGame.Params.height, Phaser.AUTO)
  game.state.add('Boot', MyLifePlatformerGame.Boot)
  game.state.add('Loading', MyLifePlatformerGame.Loading)
  game.state.add('GameTitle', MyLifePlatformerGame.MainMenu)
  game.state.add('play', MyLifePlatformerGame.PlayState)
  game.state.start('Boot')
}
