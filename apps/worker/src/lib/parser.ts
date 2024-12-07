// import z from 'zod'
// const valueSchema = z.object({
//     link: z.string(),
//     amount: z.string()
// })

export function parser( text: string, values: any,startDelimieter : string = '{', endDelimeter: string = '}') {
  //   text: string,
  //   values: any,
//   let startDelimieter = '{';
//   let endDelimeter = '}';
//   let text = 'You just received {comment.amount} as Bounty from {comment.link}';
//   let values = { link: 'nakarnakamu@gmail.com', amount: '$5' };


  let startIndex = 0;
  let endIndex = 1;

  let finalString = '';

  while (endIndex <= text.length) {
    if (text[startIndex] == startDelimieter) {
      let endPoint = startIndex + 2;
      while (text[endPoint] != endDelimeter) {
        endPoint++;
      }
      let stringHoldingValue = text.slice(startIndex + 1, endPoint);
      const keys = stringHoldingValue.split('.');
      console.log(keys);
      let localValues = { ...values };
      let val;
      for (let i = 0; i < keys.length; i++) {
        if (typeof localValues == 'string') {
          console.log('string');
          localValues = JSON.parse(localValues);
        }
        console.log(localValues);
        if (typeof keys[i] == 'string') {
          val = localValues[keys[i]];
        }
        // localValues = localValues[keys[i]];
      }
      finalString += val;
      startIndex = endPoint + 1;
      endIndex = endPoint + 2;
    } else {
      finalString += text[startIndex];
      startIndex++;
      endIndex++;
    }
  }
  if (text[startIndex]){
    console.log('jere')
    finalString += text[startIndex];
  }

  let answer = finalString;
  console.log(answer);
  return answer;
}
