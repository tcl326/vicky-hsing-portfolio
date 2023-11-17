export async function load( {fetch} ) {
    return {
        countries_json_110m: await fetch("/data/ne_110m_admin_0_countries.json")
            .then(response => response.json()),
        countries_json_50m: await fetch("/data/world-geojson.json")
            .then(response => response.json()),
        states_and_province_10m: await fetch("/data/ne_10m_admin_1_states_provinces.json")
            .then(response => response.json()),
    }
}
