const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../models/favourite');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Favourites.find({})
    .populate('user')
    .populate('dish')
    .then((favourites) => {
      favourites = favourites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
      if (!favourites) {
        var err = new Error('You have no favourites!');
        err.status = 401;
        return next(err);
      }
      else
      {  res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourites);  }
    }, (err) => next(err))
    .catch((err) =>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
  Favourites.find({})
          .populate('user')
          .populate('dish')
          .then((favourites) => {
              var user_fav;
              if(favourites)
                  user_fav = favourites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
              if(!user_fav)
                  user_fav = new Favourites({user: req.user.id});
              for(let i of req.body){
                  if(user_fav.dish.find((d_id) => {
                      if(d_id._id){
                          return d_id._id.toString() === i._id.toString();
                      }
                  }))
                      continue;
                  user_fav.dish.push(i._id);
              }
              user_fav.save()
                  .then((userFavs) => {
                  Favourites.findById(user_fav._id)
                  .populate('user')
                  .populate('dishes')
                  .then((favorite) => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(favorite);
                      console.log("Favourites Created");
                  }, (err) => next(err))
                  .catch((err) => next(err));

          })
          .catch((err) => next(err));
        })
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
  Favourites.find({})
      .populate('user')
      .populate('dish')
      .then((favourites) => {
          var fav_Remove;
          if (favourites) {
              fav_Remove = favourites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
          }
          if(fav_Remove){
              fav_Remove.remove()
                  .then((result) => {
                   Favourites.findById(result._id)
                   .populate('user')
                   .populate('dish')
                   .then((favorite) => {
                   res.statusCode = 200;
                   res.setHeader('Content-Type', 'application/json');
                   res.json(favorite);
                 },(err) => next(err))
               }, (err) => next(err));

          } else {
              var err = new Error('You did not have any favourites');
              err.status = 404;
              return next(err);
          }
      }, (err) => next(err))
      .catch((err) => next(err));
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favourites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dish.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favourites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favourites.find({})
            .populate('user')
            .populate('dish')
            .then((favourites) => {
                var user_fav;
                if(favourites)
                    user_fav = favourites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                if(!user_fav)
                    user_fav = new Favourites({user: req.user.id});
                if(!user_fav.dish.find((d_id) => {
                    if(d_id._id)
                        return d_id._id.toString() === req.params.dishId.toString();
                }))
                    user_fav.dish.push(req.params.dishId);

                user_fav.save()
                    .then((userFavs) => {
                    Favourites.findById(userFavs._id)
                    .populate('user')
                    .populate('dish')
                    .then((favorite) => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(favorite);
                        console.log("Favourites Created");
                    }, (err) => next(err))
                    .catch((err) => next(err));

            })
            .catch((err) => next(err));
          })
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favourites/:dishId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
        .populate('user')
        .populate('dish')
        .then((favourites) => {
            var user_fav;
            if(favourites)
                user_fav = favourites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            if(user_fav){
                user_fav.dish = user_fav.dish.filter((dishid) => dishid._id.toString() !== req.params.dishId);
                user_fav.save()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));

            } else {
                var err = new Error('You do not have any favourites');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = favouriteRouter;
