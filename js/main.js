window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    
    game.load.image('office', 'assets/office.jpg');
    game.load.image('desk', 'assets/desk.jpg');
    game.load.image('question', 'assets/question.png');
    game.load.image('tack', 'assets/tack.png');
    game.load.spritesheet('guy', 'assets/guyinsuit.png', 30, 32);
    game.load.audio('pickup', 'assets/pickup.mp3');
    game.load.audio('dying', 'assets/dying.mp3');
    game.load.spritesheet('enemy', 'assets/enemy.png', 30, 50);
}

var player;
var platforms;
var cursors;

var questions;
var tacks;
var score = 0;
var life = 9;
var pickup;
var enemy1; 
var enemy2;
var enemy3;
var enemy4;
var enemy5;
var dying; 
    
function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //  A simple background for our game
    game.add.tileSprite(400,0,2000, 600, 'office');
    game.world.setBounds(0, 0, 2400, 600);
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    
    game.add.text(10,10,'You are worried about an\n upcoming interview and \nneed to steal the questions.\nThe company has the best\n security and if caught you \ncould be killed. Use your \nskills to avoid the security \nand their thumbtack guns, \nwhile gathering the questions.\n Tacks kill in 3 hits and \nthe guards in one.\n\nArrow Keys to move\n Move right to start.',{ fontSize: '8px',    fill: 'white' })
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'desk');
    //platforms.create(400, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(10, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(800, 400, 'desk');
    ledge.body.immovable = true;

    ledge = platforms.create(400, 250, 'desk');
    ledge.body.immovable = true;
    
    ledge = platforms.create(1400, 300, 'desk');
    ledge.body.immovable = true;
    
    ledge = platforms.create(1500,100, 'desk');
    ledge.body.immovable = true;
    
    ledge = platforms.create(2100,350, 'desk');
    ledge.body.immovable = true;
 
    player = game.add.sprite(32, game.world.height - 150, 'guy');
    enemy1 = game.add.sprite(1900, game.world.height - 97, 'enemy');
    enemy2 = game.add.sprite(410, 216, 'enemy');
    enemy3 = game.add.sprite(1400, 270, 'enemy');
    enemy4 = game.add.sprite(1600, 65, 'enemy');
    enemy5 = game.add.sprite(2200, 320, 'enemy');
    
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(enemy1);
    game.physics.arcade.enable(enemy2);
    game.physics.arcade.enable(enemy3);
    game.physics.arcade.enable(enemy4);
    game.physics.arcade.enable(enemy5);

    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    enemy1.body.collideWorldBounds = true;
    enemy2.body.collideWorldBounds = true;
    enemy3.body.collideWorldBounds = true;
    enemy4.body.collideWorldBounds = true;
    enemy5.body.collideWorldBounds = true;
    //  Our two animations, walking left and right.
    player.animations.add('left', [3, 4, 5], 13, true);
    player.animations.add('right', [6, 7, 8], 13, true);
    enemy1.animations.add('left1', [4, 5, 6, 7], 15, true);
    enemy1.animations.add('right1', [8, 9, 10, 11], 15, true);
    enemy2.animations.add('left1', [4, 5, 6, 7], 15, true);
    enemy2.animations.add('right1', [8, 9, 10, 11], 15, true);
    enemy3.animations.add('left1', [4, 5, 6, 7], 15, true);
    enemy3.animations.add('right1', [8, 9, 10, 11], 15, true);
    enemy4.animations.add('left1', [4, 5, 6, 7], 15, true);
    enemy4.animations.add('right1', [8, 9, 10, 11], 15, true);
    enemy5.animations.add('left1', [4, 5, 6, 7], 15, true);
    enemy5.animations.add('right1', [8, 9, 10, 11], 15, true);
    //  Finally some stars to collect
    questions = game.add.group();
    tacks = game.add.group();

    //  We will enable physics for any star that is created in this group
    questions.enableBody = true;
    tacks.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var question = questions.create(i * 165 +400, 0, 'question');

        //  Let gravity do its thing
        question.body.gravity.y = 300;
    }

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
    pickup = game.add.audio('pickup');
    dying = game.add.audio('dying');
    enemy1.body.velocity.x = 100;
    enemy2.body.velocity.x = 100;
    enemy3.body.velocity.x = 100;
    enemy4.body.velocity.x = 100;
    enemy5.body.velocity.x = 100;  
    enemy1.animations.play('right1');
    enemy2.animations.play('right1');
    enemy3.animations.play('right1');
    enemy4.animations.play('right1');
    enemy5.animations.play('right1');
}

function update() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(questions, platforms);

    game.physics.arcade.overlap(player, questions, collectQs, null, this);
    game.physics.arcade.overlap(player, tacks, TackhitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy1, Enemy1HitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy2, Enemy2HitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy3, Enemy3HitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy4, Enemy4HitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy5, Enemy5HitPlayer, null, this);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    if(enemy1.x>=2000)
    {
        enemy1.body.velocity.x = -75;
        enemy1.animations.play('left1'); 
        var tack = tacks.create(2000,game.world.height - 97,'tack')
        tack.body.velocity.x = 200;
    }
    if(enemy1.x<=1800)
    {
        enemy1.body.velocity.x = 75;
        enemy1.animations.play('right1');
    }
    if(enemy2.x>=700)
    {
        enemy2.body.velocity.x = -100;
        enemy2.animations.play('left1');
        var tack = tacks.create(700,216,'tack')
        tack.body.velocity.x = 200;
    }
    if(enemy2.x<=400)
    {
        enemy2.body.velocity.x = 100;
        enemy2.animations.play('right1');
    }
    if(enemy3.x>=1600)
    {
        enemy3.body.velocity.x = -200;
        enemy3.animations.play('left1'); 
        var tack = tacks.create(1600,270,'tack')
        tack.body.velocity.x = 200;
    }
    if(enemy3.x<=1400)
    {
        enemy3.body.velocity.x = 200;
        enemy3.animations.play('right1');
        var tack = tacks.create(1600,270,'tack')
        tack.body.velocity.x = 200;
    }
    if(enemy4.x>=1800)
    {
        enemy4.body.velocity.x = -150;
        enemy4.animations.play('left1'); 
        var tack = tacks.create(1800,65,'tack')
        tack.body.velocity.x = 200;
    }
    if(enemy4.x<=1500)
    {
        enemy4.body.velocity.x = 150;
        enemy4.animations.play('right1');
    }
    if(enemy5.x>=2350)
    {
        enemy5.body.velocity.x = -125;
        enemy5.animations.play('left1'); 
    }
    if(enemy5.x<=2100)
    {
        enemy5.body.velocity.x = 125;
        enemy5.animations.play('right1');
        var tack = tacks.create(2100,320,'tack')
        tack.body.velocity.x = -200;
    }
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();
        player.frame = 0;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}

function collectQs (player, question) {
    
    question.kill();
    pickup.play();
    //  Add and update the score
    score += 10;
    if(score === 120)
    {
        game.add.text(player.x, player.y+125, 'Nice Job, you got all the questions \n and got the job!', {        fontSize: '32px',    fill: 'white' });
    }

}
function TackhitPlayer(player,tack)
    {
        tack.kill();
        life -= 1;
        if(life === 0)
        {
            game.add.text(player.x, player.y+125,'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' });
             player.kill();
             dying.play();
        }
    }
function Enemy1HitPlayer(player,enemy1)
    {
        player.kill();
        dying.play();
        game.add.text(enemy1.x-50, enemy1.y-100, 'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' });
    }
function Enemy2HitPlayer(player,enemy2)
    {
        player.kill();
        dying.play();
        game.add.text(enemy2.x, enemy2.y, 'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' }); 
     
    }
function Enemy3HitPlayer(player,enemy3)
    {
        player.kill();
        dying.play();
        game.add.text(enemy3.x, enemy3.y, 'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' });
        
    }
function Enemy4HitPlayer(player,enemy4)
    {
        player.kill();
        dying.play();
        game.add.text(enemy4.x, enemy4.y, 'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' });
        
    }
function Enemy5HitPlayer(player,enemy5)
    {
        player.kill();
        dying.play();
        game.add.text(enemy5.x, enemy5.y, 'Game Over, You lost your \n oppertunity and you \n no longer have an interview.', {        fontSize: '32px',    fill: 'white' });
        
    }
};