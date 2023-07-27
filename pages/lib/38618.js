(e, t, i) => {
    "use strict";
    i.r(t), i.d(t, {
        availableTimezones: () => l,
        timezoneIsAvailable: () => u,
        timezoneIsSupported: () => p,
        timezoneTitle: () => _,
        updateAvailableTimezones: () => d
    });
    var s = i(44352),
        r = i(88270);
    const n = [{
            id: "Etc/UTC",
            title: s.t(null, void 0, i(50406))
        }, {
            id: "exchange",
            title: s.t(null, void 0, i(77295))
        }],
        o = [{
            id: "Africa/Cairo",
            title: s.t(null, void 0, i(94099)),
            offset: 0
        }, {
            id: "Africa/Casablanca",
            title: s.t(null, void 0, i(53705)),
            offset: 0
        }, {
            id: "Africa/Johannesburg",
            title: s.t(null, void 0, i(87469)),
            offset: 0
        }, {
            id: "Africa/Lagos",
            title: s.t(null, void 0, i(89155)),
            offset: 0
        }, {
            id: "Africa/Nairobi",
            title: s.t(null, void 0, i(79023)),
            offset: 0
        }, {
            id: "Africa/Tunis",
            title: s.t(null, void 0, i(93855)),
            offset: 0
        }, {
            id: "America/Anchorage",
            title: s.t(null, void 0, i(99873)),
            offset: 0
        }, {
            id: "America/Argentina/Buenos_Aires",
            title: s.t(null, void 0, i(82446)),
            offset: 0
        }, {
            id: "America/Bogota",
            title: s.t(null, void 0, i(54173)),
            offset: 0
        }, {
            id: "America/Caracas",
            title: s.t(null, void 0, i(46837)),
            offset: 0
        }, {
            id: "America/Chicago",
            title: s.t(null, void 0, i(28244)),
            offset: 0
        }, {
            id: "America/El_Salvador",
            title: s.t(null, void 0, i(68553)),
            offset: 0
        }, {
            id: "America/Juneau",
            title: s.t(null, void 0, i(36253)),
            offset: 0
        }, {
            id: "America/Lima",
            title: s.t(null, void 0, i(25846)),
            offset: 0
        }, {
            id: "America/Los_Angeles",
            title: s.t(null, void 0, i(87604)),
            offset: 0
        }, {
            id: "America/Mexico_City",
            title: s.t(null, void 0, i(85095)),
            offset: 0
        }, {
            id: "America/New_York",
            title: s.t(null, void 0, i(91203)),
            offset: 0
        }, {
            id: "America/Phoenix",
            title: s.t(null, void 0, i(19093)),
            offset: 0
        }, {
            id: "America/Santiago",
            title: s.t(null, void 0, i(65412)),
            offset: 0
        }, {
            id: "America/Sao_Paulo",
            title: s.t(null, void 0, i(13538)),
            offset: 0
        }, {
            id: "America/Toronto",
            title: s.t(null, void 0, i(83836)),
            offset: 0
        }, {
            id: "America/Vancouver",
            title: s.t(null, void 0, i(15771)),
            offset: 0
        }, {
            id: "US/Mountain",
            title: s.t(null, void 0, i(57701)),
            offset: 0
        }, {
            id: "Asia/Almaty",
            title: s.t(null, void 0, i(14452)),
            offset: 0
        }, {
            id: "Asia/Ashkhabad",
            title: s.t(null, void 0, i(59340)),
            offset: 0
        }, {
            id: "Asia/Bahrain",
            title: s.t(null, void 0, i(53260)),
            offset: 0
        }, {
            id: "Asia/Bangkok",
            title: s.t(null, void 0, i(32376)),
            offset: 0
        }, {
            id: "Asia/Chongqing",
            title: s.t(null, void 0, i(49648)),
            offset: 0
        }, {
            id: "Asia/Colombo",
            title: s.t(null, void 0, i(15168)),
            offset: 0
        }, {
            id: "Asia/Dubai",
            title: s.t(null, void 0, i(22429)),
            offset: 0
        }, {
            id: "Asia/Ho_Chi_Minh",
            title: s.t(null, void 0, i(87338)),
            offset: 0
        }, {
            id: "Asia/Hong_Kong",
            title: s.t(null, void 0, i(32918)),
            offset: 0
        }, {
            id: "Asia/Jakarta",
            title: s.t(null, void 0, i(52707)),
            offset: 0
        }, {
            id: "Asia/Jerusalem",
            title: s.t(null, void 0, i(42890)),
            offset: 0
        }, {
            id: "Asia/Karachi",
            title: s.t(null, void 0, i(2693)),
            offset: 0
        }, {
            id: "Asia/Kathmandu",
            title: s.t(null, void 0, i(3155)),
            offset: 0
        }, {
            id: "Asia/Kolkata",
            title: s.t(null, void 0, i(16245)),
            offset: 0
        }, {
            id: "Asia/Kuwait",
            title: s.t(null, void 0, i(72374)),
            offset: 0
        }, {
            id: "Asia/Manila",
            title: s.t(null, void 0, i(90271)),
            offset: 0
        }, {
            id: "Asia/Muscat",
            title: s.t(null, void 0, i(42769)),
            offset: 0
        }, {
            id: "Asia/Nicosia",
            title: s.t(null, void 0, i(33566)),
            offset: 0
        }, {
            id: "Asia/Qatar",
            title: s.t(null, void 0, i(19056)),
            offset: 0
        }, {
            id: "Asia/Riyadh",
            title: s.t(null, void 0, i(52588)),
            offset: 0
        }, {
            id: "Asia/Seoul",
            title: s.t(null, void 0, i(5961)),
            offset: 0
        }, {
            id: "Asia/Shanghai",
            title: s.t(null, void 0, i(69240)),
            offset: 0
        }, {
            id: "Asia/Singapore",
            title: s.t(null, void 0, i(56683)),
            offset: 0
        }, {
            id: "Asia/Taipei",
            title: s.t(null, void 0, i(38788)),
            offset: 0
        }, {
            id: "Asia/Tehran",
            title: s.t(null, void 0, i(16267)),
            offset: 0
        }, {
            id: "Asia/Tokyo",
            title: s.t(null, void 0, i(94284)),
            offset: 0
        }, {
            id: "Asia/Yangon",
            title: s.t(null, void 0, i(69293)),
            offset: 0
        }, {
            id: "Atlantic/Reykjavik",
            title: s.t(null, void 0, i(26833)),
            offset: 0
        }, {
            id: "Australia/Adelaide",
            title: s.t(null, void 0, i(17365)),
            offset: 0
        }, {
            id: "Australia/Brisbane",
            title: s.t(null, void 0, i(11741)),
            offset: 0
        }, {
            id: "Australia/Perth",
            title: s.t(null, void 0, i(35590)),
            offset: 0
        }, {
            id: "Australia/Sydney",
            title: s.t(null, void 0, i(11020)),
            offset: 0
        }, {
            id: "Europe/Amsterdam",
            title: s.t(null, void 0, i(88010)),
            offset: 0
        }, {
            id: "Europe/Athens",
            title: s.t(null, void 0, i(21983)),
            offset: 0
        }, {
            id: "Europe/Belgrade",
            title: s.t(null, void 0, i(54861)),
            offset: 0
        }, {
            id: "Europe/Berlin",
            title: s.t(null, void 0, i(26825)),
            offset: 0
        }, {
            id: "Europe/Bratislava",
            title: s.t(null, void 0, i(5262)),
            offset: 0
        }, {
            id: "Europe/Brussels",
            title: s.t(null, void 0, i(90204)),
            offset: 0
        }, {
            id: "Europe/Bucharest",
            title: s.t(null, void 0, i(37728)),
            offset: 0
        }, {
            id: "Europe/Budapest",
            title: s.t(null, void 0, i(87143)),
            offset: 0
        }, {
            id: "Europe/Copenhagen",
            title: s.t(null, void 0, i(43432)),
            offset: 0
        }, {
            id: "Europe/Dublin",
            title: s.t(null, void 0, i(9497)),
            offset: 0
        }, {
            id: "Europe/Helsinki",
            title: s.t(null, void 0, i(99820)),
            offset: 0
        }, {
            id: "Europe/Istanbul",
            title: s.t(null, void 0, i(37885)),
            offset: 0
        }, {
            id: "Europe/Lisbon",
            title: s.t(null, void 0, i(50091)),
            offset: 0
        }, {
            id: "Europe/London",
            title: s.t(null, void 0, i(50286)),
            offset: 0
        }, {
            id: "Europe/Luxembourg",
            title: s.t(null, void 0, i(64352)),
            offset: 0
        }, {
            id: "Europe/Madrid",
            title: s.t(null, void 0, i(58038)),
            offset: 0
        }, {
            id: "Europe/Malta",
            title: s.t(null, void 0, i(34190)),
            offset: 0
        }, {
            id: "Europe/Moscow",
            title: s.t(null, void 0, i(18665)),
            offset: 0
        }, {
            id: "Europe/Oslo",
            title: s.t(null, void 0, i(82906)),
            offset: 0
        }, {
            id: "Europe/Paris",
            title: s.t(null, void 0, i(95995)),
            offset: 0
        }, {
            id: "Europe/Riga",
            title: s.t(null, void 0, i(5871)),
            offset: 0
        }, {
            id: "Europe/Rome",
            title: s.t(null, void 0, i(74214)),
            offset: 0
        }, {
            id: "Europe/Stockholm",
            title: s.t(null, void 0, i(48767)),
            offset: 0
        }, {
            id: "Europe/Tallinn",
            title: s.t(null, void 0, i(39108)),
            offset: 0
        }, {
            id: "Europe/Vilnius",
            title: s.t(null, void 0, i(75354)),
            offset: 0
        }, {
            id: "Europe/Warsaw",
            title: s.t(null, void 0, i(48474)),
            offset: 0
        }, {
            id: "Europe/Zurich",
            title: s.t(null, void 0, i(84301)),
            offset: 0
        }, {
            id: "Pacific/Auckland",
            title: s.t(null, void 0, i(24143)),
            offset: 0
        }, {
            id: "Pacific/Chatham",
            title: s.t(null, void 0, i(59884)),
            offset: 0
        }, {
            id: "Pacific/Fakaofo",
            title: s.t(null, void 0, i(20466)),
            offset: 0
        }, {
            id: "Pacific/Honolulu",
            title: s.t(null, void 0, i(61351)),
            offset: 0
        }, {
            id: "Pacific/Norfolk",
            title: s.t(null, void 0, i(99203)),
            offset: 0
        }];

    function a(e, t, i) {
        const s = function(e) {
                return e.map((({
                    id: e,
                    title: t
                }) => {
                    const {
                        string: i,
                        offset: s
                    } = (0, r.parseTzOffset)(e);
                    return {
                        id: e,
                        offset: s,
                        title: `(${i}) ${t}`
                    }
                }))
            }(e),
            n = i.filter((({
                alias: e
            }) => Boolean(e))).map((({
                title: e,
                alias: t,
                id: i
            }) => {
                const {
                    string: s,
                    offset: n
                } = (0, r.parseTzOffset)(t);
                return {
                    id: i,
                    offset: n,
                    title: `(${s}) ${e}`,
                    alias: t
                }
            })),
            o = function(e) {
                return e.sort(((e, t) => {
                    const i = e.offset - t.offset;
                    return 0 !== i ? i : e.title.localeCompare(t.title)
                }))
            }(s.concat(n));
        return t.concat(o)
    }
    const l = a(o, n, []),
        c = new Map;
    l.forEach((e => {
        c.set(e.id, !0)
    }));
    const h = new Map;
    n.concat(o).forEach((e => {
        h.set(e.id, !0)
    }));
    const d = e => {
        l.splice(0, l.length, ...a(o, n, e)), l.forEach((e => {
            c.set(e.id, !0)
        }))
    };

    function u(e) {
        return c.has(e)
    }

    function p(e) {
        return h.get(e) || !1
    }

    function _(e) {
        for (const {
                id: t,
                title: i
            }
            of o)
            if (t === e) {
                return `${i} (${(0,r.parseTzOffset)(e).string})`
            } for (const {
                id: t,
                title: i
            }
            of l)
            if (t === e) return `${i}`;
        return e
    }
}

