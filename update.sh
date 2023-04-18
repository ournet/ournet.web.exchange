#!/bin/bash

#update repository
git pull
yarn install
pm2 restart ./pm2.json
