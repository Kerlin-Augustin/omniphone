module.exports = function(app, passport, db) {

  // normal routes ===============================================================
  
      // show the home page (will also have our login links)
      app.get('/', function(req, res) {
          res.render('index.ejs');
      });
  
      // PROFILE SECTION =========================
      app.get('/profile', isLoggedIn, function(req, res) {

        const electronics = [
          {device: 'omni phone', src: 'https://via.placeholder.com/50/000000',cost: 700, version: 2, size:'mini'},
          {device: 'omni laptop', src: 'https://via.placeholder.com/50/000000',cost: 2000, version: 1, size: 'pro'},
          {device: 'omni speakers', src:'https://via.placeholder.com/50/000000',cost: 200, version: 1, size: 'pro max'},
          {device: 'omni tv', src:'https://via.placeholder.com/50/000000',cost: 1000, version: 2, size: 'pro'},
        ]

          db.collection('cart').find().toArray((err2, result) => {
            if (err2) return console.log(err2)
            res.render('profile.ejs', {
              user : req.user,
              electronics:electronics,
              cart: result
            })
         
        })
      });
  
      // LOGOUT ==============================
      app.get('/logout', function(req, res) {
          req.logout();
          res.redirect('/');
      });
  
  // message board routes ===============================================================
  
      app.post('/ordering', (req, res) => {
        db.collection('cart').insertOne({device: req.body.device, cost: req.body.cost, version: req.body.version, size: req.body.size, src: req.body.src}, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database', result)
          res.redirect('/profile')
        })
        
      })
  
      // app.put('/messages', (req, res) => {
      //   db.collection('messages')
      //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
      //     $set: {
      //       thumbUp:req.body.thumbUp + 1
      //     }
      //   }, {
      //     sort: {_id: -1},
      //     upsert: true
      //   }, (err, result) => {
      //     if (err) return res.send(err)
      //     res.send(result)
      //   })
      // })
  
      app.delete('/deleteItem', (req, res) => {
        console.log(req.body, 'trying to delete')
        db.collection('cart').findOneAndDelete({device: req.body.device}, (err, result) => {
          console.log('result from delete:', result)
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        })
      })
  
      
  
      app.delete('/messages', (req, res) => {
        db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        })
      })
  
  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================
  
      // locally --------------------------------
          // LOGIN ===============================
          // show the login form
          app.get('/login', function(req, res) {
              res.render('login.ejs', { message: req.flash('loginMessage') });
          });
  
          // process the login form
          app.post('/login', passport.authenticate('local-login', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/login', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));
  
          // SIGNUP =================================
          // show the signup form
          app.get('/signup', function(req, res) {
              res.render('signup.ejs', { message: req.flash('signupMessage') });
          });
  
          // process the signup form
          app.post('/signup', passport.authenticate('local-signup', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/signup', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));
  
  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future
  
      // local -----------------------------------
      app.get('/unlink/local', isLoggedIn, function(req, res) {
          var user            = req.user;
          user.local.email    = undefined;
          user.local.password = undefined;
          user.save(function(err) {
              res.redirect('/profile');
          });
      });
  
  };
  
  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();
  
      res.redirect('/');
  }
  