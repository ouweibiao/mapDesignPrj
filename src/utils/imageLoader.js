// imageLoader.js
import light from '../store/log/lightinfo.json'
import time1 from '../store/log/time0.json'
export function addTrafficLightLayers(map) {
    function change() {
        const data_total = light.map(([longitude, latitude]) => [
            [longitude - 0.00005, latitude + 0.00006],
            [longitude + 0.00005, latitude + 0.00006],
            [longitude + 0.00005, latitude - 0.00006],
            [longitude - 0.00005, latitude - 0.00006]
        ]);
        return data_total;
    }




    const UrlArr = [
        'https://s2.loli.net/2023/09/05/n4tB5xXMzgecL7S.png',
        'https://s2.loli.net/2023/09/05/2vM9Jz8huPRwNjF.png',
        'https://s2.loli.net/2023/09/05/ixZ7uIEOzj1BJgr.png',
        'https://s2.loli.net/2023/09/05/eN6w5JUkPDd1qEO.png',
        'https://s2.loli.net/2023/09/05/sfGPgymTbSALYz5.png',
        'https://s2.loli.net/2023/09/05/kj2oyMHn1YpuKCr.png',
        'https://s2.loli.net/2023/09/05/qHahvDXzZtLpBGV.png',
        'https://s2.loli.net/2023/09/05/EbdfUct1zyMQeWr.png',
    ];
    const data_total = change();

    const imagePromises = UrlArr.map((url, index) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;

            img.onload = () => {
                map.addImage(`light${index}`, img);
                resolve();
            };

            img.onerror = (error) => {
                console.error(`Failed to load image ${url}:`, error);
                reject(error);
            };
        });
    });

    Promise.all(imagePromises)
        .then(() => {
            for (let i = 0; i < light.length; i++) {
                const sourceid = 'radar' + i;
                const layerid = 'radar-layer' + i;

                map.addSource(sourceid, {
                    type: 'image',
                    url: `light${time1[1][i]}`, // 使用图片的ID
                    coordinates: data_total[i],
                });

                map.addLayer({
                    id: layerid,
                    type: 'raster',
                    source: sourceid,
                    paint: {
                        'raster-fade-duration': 0,
                    },
                });
            }

            let timecount = 1;
            setInterval(() => {
                const fileName = `../store/log/time${timecount}.json`;
                timecount++;

                import(fileName)
                    .then((module) => {
                        for (let i = 0; i < light.length; i++) {
                            const sourceid = 'radar' + i;
                            map.getSource(sourceid).updateImage({ url: `light${module.default[1][i]}` });
                        }
                    })
                    .catch((error) => {
                        console.error(`Failed to import new file ${fileName}:`, error);
                    });
            }, 1000);
        })
        .catch((error) => {
            console.error('Failed to load images:', error);
        });
    return map;
}
