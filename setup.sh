#!/bin/bash

if [[ $APP_ENV == "development" ]];
then
  mv .env.development .env.production
fi