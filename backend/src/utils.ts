import { UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export const getJWTData = (bearerToken): any => {
    if (!bearerToken) {
        throw new UnauthorizedException("No token provided");
    }
    const splitBearerToken = bearerToken.split(" ");
    if (splitBearerToken.length < 2 || splitBearerToken[0].toLowerCase() !== "bearer") {
        throw new UnauthorizedException("Invalid token");
    }
    let data;
    try {
        data = jwt.decode(splitBearerToken[1], undefined);
    } catch (err) {
        console.log(err);
        throw err;
    }
    return data;
};