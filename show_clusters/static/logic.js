
class Cluster {
    constructor(cluster, count, distance, groupColor) {
        this.id = cluster
        this.count = count
        this.distance = distance
        this.scale = 0
        this.groupColor = groupColor
        this.y = 0
        this.x = 0
        this.r = 0

    }
    setXYR(least, most, width, height) {
        // get ratio and set x, y and r
        this.scale = (this.distance - least) / (most - least)
        this.x = 50 + (this.scale * (width - 100))
        // Just some noise to pull things a little big of vertical a distance

        const full = height * 0.9
        const half = full / 2

        this.y = (height / 2) + (-half + (Math.random() * full))
        this.r = 4 + (this.count * 0.3)
        this.x = this.x.toFixed(2)
        this.y = this.y.toFixed(2)
        this.r = this.r.toFixed(2)
        this.scale = this.scale.toFixed(2)
    }
    show() {
        return JSON.stringify({
            "y": this.y,
            "x": this.x,
            "r": this.r,
            "s": this.scale
        })
    }
}
let products = {}
let clusters = {}
let groupColors = {}
let activeKey = -1
const colors = {
    "yoga": "#FFC0CB",
    "test": "#CCCCCC",
    "on the move": "#FFFF00",
    "yoga and training": "#FF69B4",
    "training": "#00FF7F",
    "running": "#FF6347",
    "swim": "#ADD8E6",
    "hiking": "#9ACD32",
    "golf": "#FFFFE0",
    "tennis": "#FFE4C4",
    "tennis and running": "#87CEFA",
    "golf and tennis": "#BDB76B",
    "other": "#1E90FF"
};


async function getClusters() {
    async function getPSVFile() {
        try {
            const response = await fetch('/static/cluster_output.txt')
            const psvContent = await response.text()
            const psvData = psvContent.split('\n').map(row => row.split('|'))
            return psvData
        } catch (error) {
            console.error(error)
        }
    }
    clusters = {}
    const x = await getPSVFile()
    x.forEach((pieces, i) => {
        const clusterId = pieces[1]
        const memberCount = pieces[2]
        const distance = parseFloat(pieces[3])
        if (clusterId !== undefined && i > 0) {



            clusters[clusterId] = new Cluster(clusterId, memberCount, distance, groupColors[clusterId])
        }
    });
    // const distances = clusters.map((obj) => obj.distance);
    const distances = []
    for (let k in clusters) {
        distances.push(clusters[k].distance)
    }
    const least = Math.min(...distances)
    const most = Math.max(...distances)


    for (let k in clusters) {
        clusters[k].setXYR(least, most, WIDTH, HEIGHT)
    }
    paint()
}

async function getProducts() {
    async function getPSVFile() {
        try {
            const response = await fetch('/static/product_output.txt')
            const psvContent = await response.text()
            const psvData = psvContent.split('\n').map(row => row.split('|'))
            return psvData
        } catch (error) {
            console.error(error)
        }
    }
    products = {}
    const x = await getPSVFile()
    let seen = {}
    x.forEach((pieces, i) => {
        if (i > 0) {
            const letter = pieces[1]
            if (letter !== undefined) {
                const group = pieces[2]
                const activity = pieces[3]
                const description = pieces[4]

                if (!products.hasOwnProperty(group)) {
                    products[group] = []
                }
                if (seen.hasOwnProperty(activity)) {
                    seen[activity]++
                } else {
                    seen[activity] = 1
                }
                const obj = {
                    letter,
                    group,
                    activity,
                    description
                }
                products[group].push(obj)
            }
        }
    });
}
async function getGroupColors() { 
    let HoL = {} 
    for ( let k in products ) {
        HoL[k] = []         
        const ary = products[k]
        ary.forEach((obj, i)=> { 
            let clr = colors["other"]
            if ( colors.hasOwnProperty(obj.activity)) {
                clr = colors[obj.activity]
            }
            HoL[k].push( clr)
        })
    }
    for ( let k in HoL ) {
        groupColors[k] = mergeColors(HoL[k])
    }
}


function paint() {

    function draw(cluster) {

        const x = cluster.x
        const y = cluster.y
        const r = cluster.r
        const groupColor = cluster.groupColor
        CONTEXT.beginPath();
        CONTEXT.arc(x, y, r, 0, Math.PI * 2);
        CONTEXT.stroke();
        // CONTEXT.fillStyle = "rgba(100,100,100, 0.4)";
        CONTEXT.fillStyle = groupColor
        CONTEXT.fill();
        CONTEXT.closePath();

    }


    function getDistance(x1, y1, x2, y2) {
        let xDistance = x2 - x1;
        let yDistance = y2 - y1;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    function findNearestCluster(mouseX, mouseY) {
        let minDist = Infinity;
        let found = -1;

        for (let k in clusters) {
            let dist = getDistance(mouseX, mouseY, clusters[k].x, clusters[k].y);
            if (dist < minDist && dist < 200) {
                minDist = dist;
                found = k
            }
        }

        return found;
    }

    canvas.addEventListener("mousemove", function (e) {
        let mouseX = e.clientX - canvas.offsetLeft;
        let mouseY = e.clientY - canvas.offsetTop;
        console.log( 'x=' + mouseX + " y=" + mouseY )
        activeKey = findNearestCluster(mouseX, mouseY);

        CONTEXT.clearRect(0, 0, canvas.width, canvas.height);
        for (let k in clusters) {
            draw(clusters[k])
        }
        if (activeKey > -1) {
            CONTEXT.beginPath();
            CONTEXT.moveTo(mouseX, mouseY);
            CONTEXT.lineTo(clusters[activeKey].x, clusters[activeKey].y);

            CONTEXT.fillStyle = "rgba(0,0,0, 1.0)";
            const id = clusters[activeKey].id
            const count = clusters[activeKey].count
            const x = clusters[activeKey].x
            const y = clusters[activeKey].y
            const r = parseInt(clusters[activeKey].r)
            CONTEXT.fillText(id + "_" + count, x - 12, y - 12)
            CONTEXT.stroke();
            CONTEXT.fill()
            CONTEXT.closePath();
        }
    });
    canvas.addEventListener("mousedown", function (e) {
        if (activeKey > -1) {
            document.getElementById("active").innerHTML = activeKey
            showSelectedProducts()
        } else {
            document.getElementById("active").innerHTML = ""
        }
    })
    for (let k in clusters) {
        draw(clusters[k])
    }
}
function highlightRow(row) {
    row.style.backgroundColor = "#ffc";
}
function unhighlightRow(row, origColor) {
    row.style.backgroundColor = origColor;
}
function handleClick(something) {
}


function showSelectedProducts() {
    if (activeKey > -1) {

        let table = `
        <table>
		<thead>
			<tr>
            <th>letter</th>
				<th>group</th>
				<th>activity</th>
                <th>description</th>
			</tr>
		</thead>
        <tbody>
        `

        products[activeKey].forEach((product, i) => {
            let css = "other"
            let x = product.activity
            if (colors.hasOwnProperty(x)) {
                css = colors[x]
            }
            table += `<tr id='id_${i}' style="background-color: ${css};" onclick="handleClick('id_${i}')" onmouseover="highlightRow(this)" onmouseout="unhighlightRow(this, '${css}')">
            <td>${product.letter}</td>
            <td>${product.group}</td>
            <td>${product.activity}</td>
            <td>${product.description}</td>
            </tr>`
        })
        table += "</tbody></table>"
        document.getElementById("group").innerHTML = table
    } else {
        document.getElementById("group").innerHTML = ""
    }
}