exports.isValidCoordinate = (coordinate = {}) => {
  const {lat, lon} = coordinate
  return (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon)) && (lat >= -90 && lat <= 90) && (lon >= -180 && lon <= 180))
}