import _ from "lodash";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Svg, { Circle, G, Text as TextSVG } from "react-native-svg";
import {
  MONTH_LABELS,
  DAYS_IN_WEEK,
  MILLISECONDS_IN_ONE_DAY,
} from "./utils/constants";
import { shiftDate, convertToDate } from "./utils/helpers";
import {
  getWeekCount,
  getStartDateWithEmptyDays,
  getNumEmptyDaysAtStart,
  getFillColor,
  getCountByDuplicateValues,
  getTooltipDataAttrsForIndex,
  getTitleForIndex,
} from "./utils/utils";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const rectColor = ["#eefafa", "#40c040"];
const CalendarHeatmap = ({
  // Default parameters instead of defaultProps
  values,
  numDays = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate(),
  endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  gutterSize = 2,
  showMonthLabels = true,
  monthLabelsColor = "white",
  showDayLabels = true,
  dayLabelsColor = "white",
  showOutOfRangeDays = false,
  colorArray = rectColor,
  onPress = () => console.log("change onPress prop"),
  tooltipDataAttrs,
  titleForValue,
}: any) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [valueCache, setValueCache] = useState({});

  useEffect(() => {
    setValueCache(getValueCache(values));
  }, [values]);

  const isToday = (index) => {
    const date = new Date(endDate);
    date.setDate(
      date.getDate() -
        (numDays - 1 - (index - getNumEmptyDaysAtStart(numDays, endDate)))
    );
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getValueCache = (values) => {
    const countedArray = getCountByDuplicateValues(values);
    return _.reduce(
      values,
      (memo, value) => {
        const date = convertToDate(value.date);
        const index = Math.floor(
          (date - getStartDateWithEmptyDays(numDays, endDate)) /
            MILLISECONDS_IN_ONE_DAY
        );
        memo[index] = {
          value: value,
        };
        const count = _.find(countedArray, { key: memo[index].value.date });
        memo[index].countedArray = count;
        return memo;
      },
      {}
    );
  };

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };
  const calculateScales = () => {
    const weekCount = getWeekCount(numDays, endDate);
    const monthLabelWidth = showMonthLabels ? 30 : 0;
    const dayLabelHeight = showDayLabels ? 20 : 0;

    // Use the full width minus small padding
    const availableWidth = dimensions.width - monthLabelWidth - 10;
    const availableHeight = dimensions.height - dayLabelHeight - 10;

    // Calculate sizes to fill the container
    const circleWidth =
      (availableWidth - gutterSize * (DAYS_IN_WEEK - 1)) / DAYS_IN_WEEK;
    const circleHeight =
      (availableHeight - gutterSize * (weekCount - 1)) / weekCount;

    // Use the smaller dimension to keep circles round
    const squareSize = Math.min(circleWidth, circleHeight);

    // Center the calendar
    const horizontalMargin =
      (availableWidth -
        (DAYS_IN_WEEK * squareSize + (DAYS_IN_WEEK - 1) * gutterSize)) /
      2;
    const verticalMargin =
      (availableHeight -
        (weekCount * squareSize + (weekCount - 1) * gutterSize)) /
      2;

    return {
      squareSize,
      horizontalMargin,
      verticalMargin,
      monthLabelWidth,
      dayLabelHeight,
      weekCount,
    };
  };
  const renderCircle = (dayIndex, weekIndex, scales) => {
    const index = weekIndex * DAYS_IN_WEEK + dayIndex;
    const indexOutOfRange =
      index < getNumEmptyDaysAtStart(numDays, endDate) ||
      index >= getNumEmptyDaysAtStart(numDays, endDate) + numDays;

    if (indexOutOfRange && !showOutOfRangeDays) {
      return null;
    }

    const { squareSize } = scales;
    const fillColor = getFillColor(index, valueCache, colorArray);

    const x = dayIndex * (squareSize + gutterSize) + squareSize / 2;
    const y = weekIndex * (squareSize + gutterSize) + squareSize / 2;

    // Check if this circle represents today
    const today = isToday(index);

    return (
      <G key={index}>
        {/* Base circle */}
        <Circle
          cx={x}
          cy={y}
          r={squareSize / 2 - 1}
          fill={fillColor}
          title={getTitleForIndex(index, valueCache, titleForValue)}
          onPress={() => onPress(index)}
          {...getTooltipDataAttrsForIndex(index, valueCache, tooltipDataAttrs)}
        />
        {/* Additional circle for today's highlight */}
        {today && (
          <Circle
            cx={x}
            cy={y}
            r={squareSize / 2 + 1}
            fill="none"
            stroke="#40c040"
            strokeWidth="2"
          />
        )}
      </G>
    );
  };

  const renderMonthLabels = (scales) => {
    if (!showMonthLabels) return null;

    const { squareSize, weekCount } = scales;

    return _.range(weekCount - 1).map((weekIndex) => {
      const endOfWeek = shiftDate(
        getStartDateWithEmptyDays(numDays, endDate),
        (weekIndex + 1) * DAYS_IN_WEEK
      );

      if (endOfWeek.getDate() >= 1 && endOfWeek.getDate() <= DAYS_IN_WEEK) {
        const y = weekIndex * (squareSize + gutterSize) + squareSize / 2;
        return (
          <TextSVG
            key={weekIndex}
            x={DAYS_IN_WEEK * (squareSize + gutterSize) + 5}
            y={y}
            textAnchor="start"
            alignmentBaseline="middle"
            stroke={monthLabelsColor}
            fontSize={squareSize * 0.4}
          >
            {MONTH_LABELS[endOfWeek.getMonth()]}
          </TextSVG>
        );
      }
      return null;
    });
  };

  const renderDayLabels = (scales) => {
    if (!showDayLabels) return null;

    const { squareSize, weekCount } = scales;
    const baseY = weekCount * (squareSize + gutterSize);

    return DAY_LABELS.map((dayLabel, index) => {
      return (
        <TextSVG
          key={index}
          x={index * (squareSize + gutterSize) + squareSize / 2}
          y={baseY + 15}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill={dayLabelsColor}
          fontSize={squareSize * 0.23}
          fontFamily="Kica-PERSONALUSE-Light"
        >
          {dayLabel}
        </TextSVG>
      );
    });
  };

  const renderAllWeeks = (scales) => {
    const { weekCount } = scales;
    return _.range(weekCount).map((weekIndex) =>
      _.range(DAYS_IN_WEEK).map((dayIndex) =>
        renderCircle(dayIndex, weekIndex, scales)
      )
    );
  };
  const scales =
    dimensions.width && dimensions.height ? calculateScales() : null;

  if (!scales) {
    return (
      <View ref={containerRef} onLayout={handleLayout} style={{ flex: 1 }} />
    );
  }
  return (
    <View
      ref={containerRef}
      onLayout={handleLayout}
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg
        width="97%"
        height="100%"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <G
          transform={`translate(${scales?.horizontalMargin || 0}, ${
            scales?.verticalMargin || 0
          })`}
        >
          {scales && renderMonthLabels(scales)}
          {scales && renderDayLabels(scales)}
          {scales && renderAllWeeks(scales)}
        </G>
      </Svg>
    </View>
  );
};

CalendarHeatmap.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    }).isRequired
  ).isRequired,
  numDays: PropTypes.number,
  endDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  gutterSize: PropTypes.number,
  showMonthLabels: PropTypes.bool,
  monthLabelsColor: PropTypes.string,
  showDayLabels: PropTypes.bool,
  dayLabelsColor: PropTypes.string,
  showOutOfRangeDays: PropTypes.bool,
  tooltipDataAttrs: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  titleForValue: PropTypes.func,
  onPress: PropTypes.func,
  colorArray: PropTypes.array,
};

const MonthlyHeatmap = ({ values }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Get the last day of the selected month
  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month + 1, 0);
  };

  // Get the first day of the selected month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1);
  };

  // Filter values for the selected month
  const getMonthValues = () => {
    return values.filter((value) => {
      const valueDate = new Date(value.date);
      return (
        valueDate.getMonth() === selectedMonth &&
        valueDate.getFullYear() === currentYear
      );
    });
  };

  // Get month name
  const getMonthName = (month) => {
    return new Date(currentYear, month, 1).toLocaleString("default", {
      month: "long",
    });
  };

  // Navigation buttons for months
  const canGoBack = selectedMonth > 0;
  const canGoForward = selectedMonth < currentMonth;

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => canGoBack && setSelectedMonth(prev => prev - 1)}
          style={[styles.navButton, !canGoBack && styles.disabledButton]}
          disabled={!canGoBack}
        >
          <Text style={styles.navButtonText}>{"<"}</Text>
        </TouchableOpacity>
         */}
      {/* <Text style={styles.monthTitle}>
          {getMonthName(selectedMonth)} {currentYear}
        </Text> */}

      {/* <TouchableOpacity 
          onPress={() => canGoForward && setSelectedMonth(prev => prev + 1)}
          style={[styles.navButton, !canGoForward && styles.disabledButton]}
          disabled={!canGoForward}
        >
          <Text style={styles.navButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View> */}

      <CalendarHeatmap
        values={getMonthValues()}
        numDays={getLastDayOfMonth(currentYear, selectedMonth).getDate()}
        endDate={getLastDayOfMonth(currentYear, selectedMonth)}
        showMonthLabels={false}
        gutterSize={2}
        showOutOfRangeDays={false}
        dayLabelsColor="#E7F5FA"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    display: "flex",
    flex: "1",
    width: "100%",
    zIndex: 999,
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    // backgroundColor: '#152026',
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
  },
  disabledButton: {
    // backgroundColor: '#cccccc',
    opacity: 0.5,
  },
});

export default MonthlyHeatmap;
