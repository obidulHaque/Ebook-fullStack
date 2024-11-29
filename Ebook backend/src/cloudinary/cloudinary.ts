import { v2 as cloudinary } from "cloudinary";

import { _confiq } from "../config/Config";
cloudinary.config({
  cloud_name: _confiq.cloudName,
  api_key: _confiq.apiKey,
  api_secret: _confiq.apiSecret, // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;
