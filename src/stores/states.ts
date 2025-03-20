import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { data } from "@/plugins/data";
type Card = data.Info;
var Data = data.Data;

// @ts-ignore
import { ConverterFactory } from "opencc-js/core";
// @ts-ignore
import cn from "opencc-js/from/cn";
// @ts-ignore
import tw from "opencc-js/to/tw";
import { InferencePriority } from "typescript";
import CardComponent from "@/components/CardComponent.vue";

const normalize = (query: string) => {
  return query.toLowerCase().replace("你", "妳").replace("啊", "阿");
};

const CC = () => {
  const converter = ConverterFactory(cn, tw);
  return converter;
};

export const useReverse = defineStore("Reverse", {
  state: () => ({ reverse: false }),
});
export const useCopyMode = defineStore("CopyMode", {
  state: () => ({ copyMode: false }),
});
export const useQuery = defineStore("Query", () => {
  const query = ref("");
  const mygoFilter = ref([] as number[]);
  const avemujicaFilter = ref([] as number[]);
  const characterFilter = ref(0);

  const updateQuery = () => {
    const url = new URL(window.location.href);
    if (query.value === "") {
      url.searchParams.delete("q");
    } else {
      url.searchParams.set("q", query.value);
    }
    var ep = 0;
    for (var i = 1; i < 14; i++) {
      ep |= +mygoFilter.value.includes(i) << (i - 1);
    }
    for (var i = 1; i < 9; i++) {
      ep |= +avemujicaFilter.value.includes(i) << (i + 12);
    }
    if (ep == 0) {
      url.searchParams.delete("ep");
    } else {
      url.searchParams.set("ep", ep.toString());
    }
    window.history.pushState({}, "", url.toString());
  };

  watch(query, updateQuery);
  watch(mygoFilter, updateQuery);
  watch(avemujicaFilter, updateQuery);
  watch(characterFilter, updateQuery);

  return { query, mygoFilter, avemujicaFilter, characterFilter };
});
export const useData = defineStore("Data", () => {
  const cardsData = ref([] as Card[]);

  const query = useQuery();
  const reverse = useReverse();

  reverse.$subscribe(() => {
    cardsData.value.reverse();
  });

  const converter = CC();
  var episodeCache = new Map<string, Card[]>();

  const filteredCards = computed(() => {
    if (cardsData.value.length === 0) {
      return [];
    }
    var filted = cardsData.value;
    var episodeFilter = new Set<string>();
    query.mygoFilter.forEach((element) => {
        episodeFilter.add(`1-${element}`);
    });
    query.avemujicaFilter.forEach((element) => {
      episodeFilter.add(`2-${element}`);
    });
    if (episodeFilter.size !== 0) {
      const key = reverse.reverse + Array.from(episodeFilter).join("");
      if (episodeCache.has(key)) {
        filted = episodeCache.get(key) ?? [];
      } else {
        filted = cardsData.value.filter((card) =>
          episodeFilter.has(`${card.season}-${card.episode}`),
        );
        episodeCache.set(key, filted);
      }
    }

    if (query.query === "") {
      return filted;
    } else {
      const temp: string = converter(normalize(query.query));
      return filted.filter((card) => normalize(card.text).includes(temp));
    }
  });

  const fetchData = async () => {
    if (cardsData.value.length !== 0) {
      return;
    }
    var data: Card[];
    try {
      var buf = await (await fetch("/data/data.bin")).bytes();
      data = Data.decode(buf).info as Card[];
    } catch (e) {
      data = [] as Card[];
    }
    cardsData.value = data as Card[];
    episodeCache.clear();
  };

  return { cardsData, fetchData, filteredCards };
});
