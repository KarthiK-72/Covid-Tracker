import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
function InfoBox({
  theme,
  title,
  isBlue,
  isGreen,
  isRed,
  isGrey,
  active,
  cases,
  total,
  ...props
}) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      } ${isGrey && "infoBox--grey"} ${isBlue && "infoBox--blue"} ${
        !theme && "infoBox__dark"
      } `}
    >
      <CardContent>
        {/* Title */}
        <Typography
          className={`infoBox__title ${
            !theme && isRed && "infoBox__darkTitleRed"
          }

        ${!theme && isBlue && "infoBox__darkTitleBlue"}
        ${!theme && isGrey && "infoBox__darkTitleGrey"}
        ${!theme && isGreen && "infoBox__darkTitleGreen"}`}
          color="textSecondary"
        >
          {title}
        </Typography>

        {/* Number of Cases */}
        <h2
          className={`infoBox__cases ${isRed && "infoBox__cases--red"} ${
            isGrey && "infoBox__cases--grey"
          } ${isBlue && "infoBox__cases--blue"}
          ${isGreen && "infoBox__cases--green"}`}
        >
          {props.isloading ? <i className="fa fa-cog fa-spin fa-fw" /> : cases}
        </h2>

        {/* Total Cases */}
        <Typography
          className={`infoBox__total ${
            !theme && isRed && "infoBox__darkTitleRed"
          }
        ${!theme && isBlue && "infoBox__darkTitleBlue"}
        ${!theme && isGrey && "infoBox__darkTitleGrey"}
        ${!theme && isGreen && "infoBox__darkTitleGreen"} `}
          color="textSecondary"
        >
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
