const pufAuth = artifacts.require('pufAuth');

contract('pufAuth', () => {
  let PufAuth = null;
  before(async () => {
    PufAuth = await pufAuth.deployed();
  });

  it('Should get challenge', async () => {

    const Challenge = await PufAuth.getChallenge();
    //await PufAuth.viewGetChallenge();

    assert(Challenge[0].toNumber() === 0);
    assert(Challenge[1].toNumber() === 1);
    assert(Challenge[2].toNumber() === 1);
    assert(Challenge[3].toNumber() === 1);
    assert(Challenge[4].toNumber() === 0);
    assert(Challenge[5].toNumber() === 1);
    assert(Challenge[6].toNumber() === 0);
    assert(Challenge[7].toNumber() === 0);
    assert(Challenge[8].toNumber() === 0);
    assert(Challenge[9].toNumber() === 0);
    assert(Challenge[10].toNumber() === 1);
    assert(Challenge[11].toNumber() === 1);
    assert(Challenge[12].toNumber() === 1);
    assert(Challenge[13].toNumber() === 0);
    assert(Challenge[14].toNumber() === 0);
    assert(Challenge[15].toNumber() === 1);
    assert(Challenge[16].toNumber() === 1);
    assert(Challenge[17].toNumber() === 1);
    assert(Challenge[18].toNumber() === 1);
    assert(Challenge[19].toNumber() === 0);
    assert(Challenge[20].toNumber() === 0);
    assert(Challenge[21].toNumber() === 0);
    assert(Challenge[22].toNumber() === 1);
    assert(Challenge[23].toNumber() === 0);
    assert(Challenge[24].toNumber() === 1);
    assert(Challenge[25].toNumber() === 0);
    assert(Challenge[26].toNumber() === 0);
    assert(Challenge[27].toNumber() === 1);
    assert(Challenge[28].toNumber() === 0);
    assert(Challenge[29].toNumber() === 1);
    assert(Challenge[30].toNumber() === 0);
    assert(Challenge[31].toNumber() === 0);
//[0,1,1,1,0,1,0,0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,1,0,1,0,0,1,0,1,0,0]);
  });

  it('Should extract helper data information', async () => {

    await PufAuth.helperDataExtraction(4);
    const helperData = await PufAuth.viewHelperDataExtraction();

    assert(helperData[0].toNumber() === 3);
    assert(helperData[1].toNumber() === 6);
    assert(helperData[2].toNumber() === 4);
    assert(helperData[3].toNumber() === 8);
    assert(helperData[4].toNumber() === 5);
    assert(helperData[5].toNumber() === 6);
    assert(helperData[6].toNumber() === 3);
    assert(helperData[7].toNumber() === 9);
  });
//3,6,4,8,5,6,3,9

 it('Should claculate delta deficiency', async () => {
    await PufAuth.deltaCalculation([0,1,0,0,1,1,0,0,1,0,0,1,1,1,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,1,1], 			[1,1,0,1,0,0,0,1,1,0,1,0,1,0,1,0,0,0,0,0,1,1,0,1,0,1,0,1,1,1,1,0], [0,0,0,1,1,0,1,0,1,0,1,0,0,0,1,1,1,1,0,1,0,1,1,1,0,0,0,1,0,1,0,0], 2586);
    const Delta = await PufAuth.viewDeltaCalculation();

    assert(Delta[0].toNumber() === 5);
    assert(Delta[1].toNumber() === 0);
    assert(Delta[2].toNumber() === 0);
    assert(Delta[3].toNumber() === 2);
    assert(Delta[4].toNumber() === 0);
    assert(Delta[5].toNumber() === 1);
    assert(Delta[6].toNumber() === 0);
    assert(Delta[7].toNumber() === 0);
  });

   it('Should correct PUF response', async () => {
    await PufAuth.pufCorrection();
    const correctResponse = await PufAuth.viewPufCorrection();

    assert(correctResponse[0].toNumber() === 0);
    assert(correctResponse[1].toNumber() === 1);
    assert(correctResponse[2].toNumber() === 0);
    assert(correctResponse[3].toNumber() === 1);
    assert(correctResponse[4].toNumber() === 1);
    assert(correctResponse[5].toNumber() === 1);
    assert(correctResponse[6].toNumber() === 0);
    assert(correctResponse[7].toNumber() === 0);
    assert(correctResponse[8].toNumber() === 1);
    assert(correctResponse[9].toNumber() === 0);
    assert(correctResponse[10].toNumber() === 0);
    assert(correctResponse[11].toNumber() === 1);
    assert(correctResponse[12].toNumber() === 1);
    assert(correctResponse[13].toNumber() === 0);
    assert(correctResponse[14].toNumber() === 0);
    assert(correctResponse[15].toNumber() === 0);
    assert(correctResponse[16].toNumber() === 1);
    assert(correctResponse[17].toNumber() === 0);
    assert(correctResponse[18].toNumber() === 1);
    assert(correctResponse[19].toNumber() === 0);
    assert(correctResponse[20].toNumber() === 0);
    assert(correctResponse[21].toNumber() === 0);
    assert(correctResponse[22].toNumber() === 1);
    assert(correctResponse[23].toNumber() === 0);
    assert(correctResponse[24].toNumber() === 0);
    assert(correctResponse[25].toNumber() === 1);
    assert(correctResponse[26].toNumber() === 0);
    assert(correctResponse[27].toNumber() === 1);
    assert(correctResponse[28].toNumber() === 0);
    assert(correctResponse[29].toNumber() === 1);
    assert(correctResponse[30].toNumber() === 1);
    assert(correctResponse[31].toNumber() === 1);
  });

  it('Should Check PUF response', async () => {
    await PufAuth.pufChecking();
    const Response = await PufAuth.viewPufChecking();

    assert(Response === '0xde374a00b708cfb0078f923e4fde6cf9b66a7c42099f0c1b5be13d74032a0f88');

  });

});



