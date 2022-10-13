/**
 * Copyright (C) 2020 
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
 'use strict';

 /**
  * @file RESTFUL to update/get User collection
  */
 const express = require('express');
 const cmEnum = require('../common/enum');
 const Service = require('./service');
 const router = express.Router(); // not protected from csrf
 const csrfRouter = express.Router(); // protected from csrf
 const tokenRouter = express.Router(); // protected from csrf
 
 router.get('/sortarray',Service.sort,Service.remove_duplicate,(req,res)=>{
    res.json({"result":req.array})
 })
 exports.setup = (routerType) => {
     if (routerType === cmEnum.RouterType.AUTH_BY_TOKEN_ONLY) {
         return tokenRouter;
     } else if (routerType === cmEnum.RouterType.NO_CSRF) {
         return router;
     } else if (routerType === cmEnum.RouterType.WITH_CSRF) {
         return csrfRouter;
     }
 };
 