exports.temp_handler = (req, res) => {
  console.log('Temp Handler');
  const obj = {
    temp_key: 'temp value',
  };
  res.send(JSON.stringify(obj));
  console.log('Sent object');
};

