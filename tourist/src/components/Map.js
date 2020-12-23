import React, { Component } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

//am4core.useTheme(am4themes_animated);

class Map extends Component {

  constructor(props) {
    super(props);

    let arcGradient = new am4core.LinearGradient();
    this.colours = {
      unavailable: "#ededed",
      default: "#b8dbb8",
      default_alt: "#002b03",
      chosen: "#033800",
      available: "#089c00",
      availableArc: arcGradient,
    };

    arcGradient.addColor(am4core.color(this.colours.default_alt), 0, 0);
    arcGradient.addColor(am4core.color(this.colours.default_alt), 0.5, 0.1);
    arcGradient.addColor(am4core.color(this.colours.default_alt), 0.5, 0.9);
    arcGradient.addColor(am4core.color(this.colours.default_alt), 0, 1);

    this.currentlyColoured = [];
  }

  componentDidMount() {
    let map = am4core.create("map-container", am4maps.MapChart);
    map.zoomControl = new am4maps.ZoomControl();
    map.geodata = am4geodata_worldLow;
    map.projection = new am4maps.projections.Miller();
    map.homeZoomLevel = 5;
    map.homeGeoPoint = {
      latitude: 52,
      longitude: 11,
    }

    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML = "<div id='map-tooltip' class='flag flag-{id}'></div> {name}";
    polygonTemplate.fill = am4core.color(this.colours.unavailable);

    let legend = new am4maps.Legend();
    legend.parent = map.chartContainer;
    legend.data = [{
      "name": "No data",
      "fill": this.colours.unavailable
    }, {
      "name": "Data available",
      "fill": this.colours.default
    }, {
      "name": "Allowed",
      "fill": this.colours.available
    }];
    legend.itemContainers.template.clickable = false;
    legend.itemContainers.template.focusable = false;

    // Clicked on a country
    polygonTemplate.events.on('hit', (ev) => {
      if (this.props.availableCountries.includes(ev.target.dataItem.dataContext.id)) {
        // TODO: Make this not simulate an event
        let e = {"target": {"value": null}};
        e.target.value = ev.target.dataItem.dataContext.id;

        this.props.onCountryClick(e);
      }
    });

    // When map is ready, colour in the available countries
    map.events.on('ready', () => {
      this.props.availableCountries.forEach((code) => {
        try {
          polygonSeries.getPolygonById(code).fill = this.colours.default;
        } catch (e) {
          console.error(code + " could not be found via its id.");
        }
      });
    });

    // No Antartica
    polygonSeries.exclude = ["AQ"];

    polygonSeries.calculateVisualCenter = true;

    let arcSeries = map.series.push(new am4maps.MapArcSeries());

    let arcTemplate = arcSeries.mapLines.template;
    arcTemplate.stroke = this.colours.availableArc;
    arcTemplate.fill = this.colours.availableArc;
    arcTemplate.line.strokeWidth = 1.0;
    arcTemplate.line.nonScalingStroke = true;
    arcTemplate.line.controlPointDistance = -0.3;
    arcTemplate.line.controlPointPosition = 0.5;

    this.map = map;
    this.polygonSeries = polygonSeries;
    this.polygonTemplate = polygonTemplate;
    this.arcSeries = arcSeries;
  }

  componentDidUpdate() {
    if (this.props.chosenCountry != null) {

      // Before we begin colouring, clean up previous coloured countries
      this.currentlyColoured.forEach((poly) => {
        poly.fill = am4core.color(this.colours.default);
      })
      this.currentlyColoured = [];

      let destCoordsArray = [];

      // Colour every allowed country with the available colour.
      this.props.isAllowedInto.forEach((c) => {
        let allowedCountry = this.polygonSeries.getPolygonById(c.code);
        allowedCountry.fill = am4core.color(this.colours.available);

        // Also keep track of the coloured countries
        this.currentlyColoured.push(allowedCountry);

        // While we're here, grab the coords of every destination country
        // that the arcs are going to use.
        let newDestCoord = { "latitude": 0, "longitude": 0 };
        newDestCoord.latitude = allowedCountry.visualLatitude;
        newDestCoord.longitude = allowedCountry.visualLongitude;
        destCoordsArray.push(newDestCoord);
      });

      // Colour the origin country as well
      let chosenCountryPoly = this.polygonSeries.getPolygonById(this.props.chosenCountry);
      chosenCountryPoly.fill = am4core.color(this.colours.chosen);
      this.currentlyColoured.push(chosenCountryPoly);

      //
      // Arcs
      //

      let chosenCoords = { "latitude": 0, "longitude": 0 };
      chosenCoords.latitude = chosenCountryPoly.visualLatitude;
      chosenCoords.longitude = chosenCountryPoly.visualLongitude;

      let newArcSeriesData = [{ "multiGeoLine": [] }];

      destCoordsArray.forEach((destCoord) => {
        let newData = [];
        newArcSeriesData[0].multiGeoLine.push([chosenCoords, destCoord]);
        //newArcSeriesData.push(newData);
      });

      this.arcSeries.data = newArcSeriesData;
    }
  }

  render() {
    return (
      <div id="map-container" className="mx-auto"></div>
    );
  }
}

export default Map;