import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { UserModel } from '../models/User.model.js'
import { UrlModel } from '../models/Url.model.js'
import { auth } from "../middlewares/AuthMiddlewares.js";

export { express, mongoose, nanoid, auth, UserModel, UrlModel, path, fileURLToPath, jwt, bcrypt, cookieParser };