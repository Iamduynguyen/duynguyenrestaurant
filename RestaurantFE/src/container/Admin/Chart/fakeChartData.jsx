const fakeData = []

function generateData(){
  for(let i = 0; i<= 12; i++){
    const item = Math.floor(Math.random()*1000 + 1);
    fakeData.push(item);
  }
}
generateData();
console.log(fakeData);

export default fakeData;