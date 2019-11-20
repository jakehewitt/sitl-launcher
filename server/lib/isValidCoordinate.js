exports.isValidCoordinate = (coordinate = {}) => {
  const {lat, lon} = coordinate
  return (!isNaN(lat) && !isNaN(lon) && (lat >= -90 && lat <= 90) && (lon >= -180 && lon <= 180))
}