const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {GoogleGenerativeAI} = require("@google/generative-ai");

exports.generateRecommendedSpots = onRequest(
    {region: "asia-northeast1", maxInstances: 1, cors: ["*"]},
    async (request, response) => {
      try {
        if (request.method !== "POST") {
          response.status(405).send("Method Not Allowed");
          return;
        }
        /**
       * @type {{ location:string, category:string, inout:string }}
       */
        const {location, category, inout} = request.body;
        if (!location || !category || !inout) {
          response.status(400).json({
            error: "Bad Request",
            reason: "Location, category and inout are required.",
          });
          return;
        }
        const result = await runAI(location, category, inout);
        logger.log(result);
        response.status(200).send(result);
      } catch (error) {
        logger.error(error);
        response.status(500).send("Internal Server Error");
      }
    },
);

/**
 * @param {string} location
 * @param {string} category
 * @param {string} inout
 */
async function runAI(location, category, inout) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `入力するのは現在地、希望カテゴリー、屋内か屋外かの３つの条件です。\n
    該当する一人旅におすすめのスポット5つを"spot"に出力してください。\n
    それぞれの提案理由を"reason"に出力してください。\n
    提案したスポットの緯度を"address"の"latitude"に出力してください。\n
    提案してスポットの経度を"address"の"longtitude"に出力してください。`,
  });

  const chatSession = model.startChat({
    generationConfig: {
      temperature: 2,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          information: {
            type: "array",
            items: {
              type: "object",
              properties: {
                spot: {
                  type: "string",
                },
                reason: {
                  type: "string",
                },
                address: {
                  type: "object",
                  properties: {
                    latitude: {
                      type: "string",
                    },
                    longtitude: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    history: [
      {
        role: "user",
        parts: [
          {
            text: "現在地:大阪府\n希望カテゴリー:遊ぶところ\n屋内か屋外か:屋内",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `{
                "information": [
                  {
                    "address": {
                      "latitude": "34.6867",
                      "longitude": "135.5202"
                    },
                    "reason": "大阪城天守閣は、大阪城の中心となる天守閣です。高さは55メートル、地上8階建て、\
                    地下2階建てです。内部には博物館が併設されており、大阪の歴史や文化を学ぶことができます。\
                    天守閣の展望台からは、大阪市街を一望することができます。大阪城天守閣は、大阪の歴史と文化\
                    を満喫できるスポットです。一人旅でも楽しめるので、おすすめです。",
                    "spot": "大阪城天守閣"
                  },
                  {
                    "address": {
                      "latitude": "34.6879",
                      "longitude": "135.5204"
                    },
                    "reason": "大阪城公園は、大阪城天守閣を中心とした広大な公園です。公園内には、日本庭園、\
                    博物館、美術館などがあり、一日中楽しめます。また、季節の花々や木々も美しく、一年を通して\
                    楽しめます。大阪城公園は、大阪の自然と歴史に触れることができる、一人旅におすすめのスポットです。",
                    "spot": "大阪城公園"
                  },
                  {
                    "address": {
                      "latitude": "34.6946",
                      "longitude": "135.5157"
                    },
                    "reason": "大阪市立科学館は、大阪市西区にある科学館です。科学館では、宇宙、地球、生命、科学\
                    技術に関する様々な展示がされており、大人から子供まで楽しめる場所です。また、プラネタリウムや\
                    サイエンスショーなどもあり、飽きないで楽しめます。大阪市立科学館は、一人旅でも楽しめる科学館です。",
                    "spot": "大阪市立科学館"
                  },
                  {
                    "address": {
                      "latitude": "34.6986",
                      "longitude": "135.5213"
                    },
                    "reason": "国立国際美術館は、大阪市北区にある美術館です。美術館では、近代美術から現代美術\
                    まで幅広い作品を展示しており、美術ファンはもちろんのこと、初めて美術館を訪れる人にもおすすめ\
                    です。また、美術館の建物もモダンで美しく、見ごたえがあります。国立国際美術館は、一人旅でも楽\
                    しめる美術館です。",
                    "spot": "国立国際美術館"
                  },
                  {
                    "address": {
                      "latitude": "34.6981",
                      "longitude": "135.5127"
                    },
                    "reason": "大阪歴史博物館は、大阪市中央区にある博物館です。博物館では、大阪の歴史や文化を、\
                    豊富な資料や展示物を通して紹介しています。また、大阪の歴史を体感できるジオラマや映像展示も\
                    あり、歴史に興味のある人におすすめです。大阪歴史博物館は、一人旅でも楽しめる博物館です。",
                    "spot": "大阪歴史博物館"
                  }
                ]
              }`,
          },
        ],
      },
    ],
  });

  const inputMessage = `現在地: ${location}\n
                        希望カテゴリー: ${category}\n
                        屋内か屋外か: ${inout}`;
  const result = await chatSession.sendMessage(inputMessage);
  logger.log(result);
  return result.response.text();
}
