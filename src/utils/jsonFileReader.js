const fs = require('fs').promises; // 引入fs.promises来使用异步操作

// 定义一个异步函数，用于读取JSON文件并提取数据
async function readAndProcessJSONFiles(startTime, endTime) {
    // 创建一个空数组来存储每个文件的数据
    const fileDataArray = [];

    // 使用for循环遍历文件时间范围
    for (let timecount = startTime; timecount <= endTime; timecount++) {
        try {
            // 构建文件路径，注意此路径应该是相对于 Node.js 环境的
            const filePath = `../store/vehicle/global${timecount}.json`;

            // 异步读取JSON文件内容
            const fileData = await fs.readFile(filePath, 'utf8');

            // 解析JSON数据
            const jsonData = JSON.parse(fileData);

            // 提取所需的数据并将其存储在数组中
            const extractedData = {
                trafficLights: {
                    totalWithoutInterference: jsonData[0][0],
                    totalPassengers: jsonData[0][1],
                    totalWithoutInterferenceRate: jsonData[0][2],
                },
                vehicles: {
                    totalTravelTime: jsonData[1][0],
                    totalVehiclesGenerated: jsonData[1][1],
                    averageTravelTime: jsonData[1][2],
                    averageSpeed: jsonData[1][3],
                    totalParkingCount: jsonData[1][4],
                    averageParkingCount: jsonData[1][5],
                    totalParkingTime: jsonData[1][6],
                    averageParkingTime: jsonData[1][7],
                    parkingTimeRatio: jsonData[1][8],
                },
            };

            // 将提取的数据添加到数组中
            fileDataArray.push(extractedData);
            //console('read success')
        } catch (error) {
            console.error(`Failed to read and process file vehicle${timecount}.json:`, error);
        }
    }

    // 返回包含所有文件数据的数组
    return fileDataArray;
}

// 导出 readAndProcessJSONFiles 函数
module.exports = { readAndProcessJSONFiles };
