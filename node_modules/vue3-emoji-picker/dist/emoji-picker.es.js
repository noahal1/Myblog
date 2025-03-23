import { reactive, readonly, toRaw, defineComponent, inject, ref, computed, getCurrentInstance, watch, openBlock, createElementBlock, createElementVNode, normalizeClass, Fragment, renderList, withDirectives, toDisplayString, vShow, createCommentVNode, vModelText, onMounted, onBeforeUnmount, resolveComponent, createVNode, provide, createBlock } from "vue";
const EMOJI_REMOTE_SRC = "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@6.0.1/img/apple/64";
const GROUP_NAMES = {
  recent: "Recently used",
  smileys_people: "Smiles & People",
  animals_nature: "Animals & Nature",
  food_drink: "Food & Drink",
  activities: "Activities",
  travel_places: "Travel places",
  objects: "Objects",
  symbols: "Symbols",
  flags: "Flags"
};
const EMOJI_UNICODE_KEY = "u";
const EMOJI_NAME_KEY = "n";
const EMOJI_VARIATIONS_KEY = "v";
const EMOJI_RESULT_KEY = "r";
const DEFAULT_EMOJI = {
  [EMOJI_NAME_KEY]: ["grinning face", "grinning"],
  [EMOJI_UNICODE_KEY]: "1f600",
  [EMOJI_RESULT_KEY]: "1f600"
};
const SKIN_TONE_NEUTRAL = "neutral";
const SKIN_TONE_LIGHT = "1f3fb";
const SKIN_TONE_MEDIUM_LIGHT = "1f3fc";
const SKIN_TONE_MEDIUM = "1f3fd";
const SKIN_TONE_MEDIUM_DARK = "1f3fe";
const SKIN_TONE_DARK = "1f3ff";
const SKIN_TONES = [
  SKIN_TONE_NEUTRAL,
  SKIN_TONE_LIGHT,
  SKIN_TONE_MEDIUM_LIGHT,
  SKIN_TONE_MEDIUM,
  SKIN_TONE_MEDIUM_DARK,
  SKIN_TONE_DARK
];
const STATIC_TEXTS = {
  placeholder: "Search emoji",
  skinTone: "Skin tone"
};
const COLOR_THEMES = ["light", "dark", "auto"];
const smileys_people$1 = [
  {
    n: [
      "grinning face",
      "grinning"
    ],
    u: "1f600"
  },
  {
    n: [
      "grinning face with smiling eyes",
      "grin"
    ],
    u: "1f601"
  },
  {
    n: [
      "face with tears of joy",
      "joy"
    ],
    u: "1f602"
  },
  {
    n: [
      "rolling on the floor laughing",
      "rolling_on_the_floor_laughing"
    ],
    u: "1f923"
  },
  {
    n: [
      "smiling face with open mouth",
      "smiley"
    ],
    u: "1f603"
  },
  {
    n: [
      "smiling face with open mouth and smiling eyes",
      "smile"
    ],
    u: "1f604"
  },
  {
    n: [
      "smiling face with open mouth and cold sweat",
      "sweat_smile"
    ],
    u: "1f605"
  },
  {
    n: [
      "smiling face with open mouth and tightly-closed eyes",
      "laughing",
      "satisfied"
    ],
    u: "1f606"
  },
  {
    n: [
      "winking face",
      "wink"
    ],
    u: "1f609"
  },
  {
    n: [
      "smiling face with smiling eyes",
      "blush"
    ],
    u: "1f60a"
  },
  {
    n: [
      "face savouring delicious food",
      "yum"
    ],
    u: "1f60b"
  },
  {
    n: [
      "smiling face with sunglasses",
      "sunglasses"
    ],
    u: "1f60e"
  },
  {
    n: [
      "smiling face with heart-shaped eyes",
      "heart_eyes"
    ],
    u: "1f60d"
  },
  {
    n: [
      "face throwing a kiss",
      "kissing_heart"
    ],
    u: "1f618"
  },
  {
    n: [
      "kissing face",
      "kissing"
    ],
    u: "1f617"
  },
  {
    n: [
      "kissing face with smiling eyes",
      "kissing_smiling_eyes"
    ],
    u: "1f619"
  },
  {
    n: [
      "kissing face with closed eyes",
      "kissing_closed_eyes"
    ],
    u: "1f61a"
  },
  {
    n: [
      "white smiling face",
      "relaxed"
    ],
    u: "263a-fe0f"
  },
  {
    n: [
      "slightly smiling face",
      "slightly_smiling_face"
    ],
    u: "1f642"
  },
  {
    n: [
      "hugging face",
      "hugging_face"
    ],
    u: "1f917"
  },
  {
    n: [
      "grinning face with star eyes",
      "star-struck",
      "grinning_face_with_star_eyes"
    ],
    u: "1f929"
  },
  {
    n: [
      "thinking face",
      "thinking_face"
    ],
    u: "1f914"
  },
  {
    n: [
      "face with one eyebrow raised",
      "face_with_raised_eyebrow",
      "face_with_one_eyebrow_raised"
    ],
    u: "1f928"
  },
  {
    n: [
      "neutral face",
      "neutral_face"
    ],
    u: "1f610"
  },
  {
    n: [
      "expressionless face",
      "expressionless"
    ],
    u: "1f611"
  },
  {
    n: [
      "face without mouth",
      "no_mouth"
    ],
    u: "1f636"
  },
  {
    n: [
      "face with rolling eyes",
      "face_with_rolling_eyes"
    ],
    u: "1f644"
  },
  {
    n: [
      "smirking face",
      "smirk"
    ],
    u: "1f60f"
  },
  {
    n: [
      "persevering face",
      "persevere"
    ],
    u: "1f623"
  },
  {
    n: [
      "disappointed but relieved face",
      "disappointed_relieved"
    ],
    u: "1f625"
  },
  {
    n: [
      "face with open mouth",
      "open_mouth"
    ],
    u: "1f62e"
  },
  {
    n: [
      "zipper-mouth face",
      "zipper_mouth_face"
    ],
    u: "1f910"
  },
  {
    n: [
      "hushed face",
      "hushed"
    ],
    u: "1f62f"
  },
  {
    n: [
      "sleepy face",
      "sleepy"
    ],
    u: "1f62a"
  },
  {
    n: [
      "tired face",
      "tired_face"
    ],
    u: "1f62b"
  },
  {
    n: [
      "sleeping face",
      "sleeping"
    ],
    u: "1f634"
  },
  {
    n: [
      "relieved face",
      "relieved"
    ],
    u: "1f60c"
  },
  {
    n: [
      "face with stuck-out tongue",
      "stuck_out_tongue"
    ],
    u: "1f61b"
  },
  {
    n: [
      "face with stuck-out tongue and winking eye",
      "stuck_out_tongue_winking_eye"
    ],
    u: "1f61c"
  },
  {
    n: [
      "face with stuck-out tongue and tightly-closed eyes",
      "stuck_out_tongue_closed_eyes"
    ],
    u: "1f61d"
  },
  {
    n: [
      "drooling face",
      "drooling_face"
    ],
    u: "1f924"
  },
  {
    n: [
      "unamused face",
      "unamused"
    ],
    u: "1f612"
  },
  {
    n: [
      "face with cold sweat",
      "sweat"
    ],
    u: "1f613"
  },
  {
    n: [
      "pensive face",
      "pensive"
    ],
    u: "1f614"
  },
  {
    n: [
      "confused face",
      "confused"
    ],
    u: "1f615"
  },
  {
    n: [
      "upside-down face",
      "upside_down_face"
    ],
    u: "1f643"
  },
  {
    n: [
      "money-mouth face",
      "money_mouth_face"
    ],
    u: "1f911"
  },
  {
    n: [
      "astonished face",
      "astonished"
    ],
    u: "1f632"
  },
  {
    n: [
      "white_frowning_face"
    ],
    u: "2639-fe0f"
  },
  {
    n: [
      "slightly frowning face",
      "slightly_frowning_face"
    ],
    u: "1f641"
  },
  {
    n: [
      "confounded face",
      "confounded"
    ],
    u: "1f616"
  },
  {
    n: [
      "disappointed face",
      "disappointed"
    ],
    u: "1f61e"
  },
  {
    n: [
      "worried face",
      "worried"
    ],
    u: "1f61f"
  },
  {
    n: [
      "face with look of triumph",
      "triumph"
    ],
    u: "1f624"
  },
  {
    n: [
      "crying face",
      "cry"
    ],
    u: "1f622"
  },
  {
    n: [
      "loudly crying face",
      "sob"
    ],
    u: "1f62d"
  },
  {
    n: [
      "frowning face with open mouth",
      "frowning"
    ],
    u: "1f626"
  },
  {
    n: [
      "anguished face",
      "anguished"
    ],
    u: "1f627"
  },
  {
    n: [
      "fearful face",
      "fearful"
    ],
    u: "1f628"
  },
  {
    n: [
      "weary face",
      "weary"
    ],
    u: "1f629"
  },
  {
    n: [
      "shocked face with exploding head",
      "exploding_head",
      "shocked_face_with_exploding_head"
    ],
    u: "1f92f"
  },
  {
    n: [
      "grimacing face",
      "grimacing"
    ],
    u: "1f62c"
  },
  {
    n: [
      "face with open mouth and cold sweat",
      "cold_sweat"
    ],
    u: "1f630"
  },
  {
    n: [
      "face screaming in fear",
      "scream"
    ],
    u: "1f631"
  },
  {
    n: [
      "flushed face",
      "flushed"
    ],
    u: "1f633"
  },
  {
    n: [
      "grinning face with one large and one small eye",
      "zany_face",
      "grinning_face_with_one_large_and_one_small_eye"
    ],
    u: "1f92a"
  },
  {
    n: [
      "dizzy face",
      "dizzy_face"
    ],
    u: "1f635"
  },
  {
    n: [
      "pouting face",
      "rage"
    ],
    u: "1f621"
  },
  {
    n: [
      "angry face",
      "angry"
    ],
    u: "1f620"
  },
  {
    n: [
      "serious face with symbols covering mouth",
      "face_with_symbols_on_mouth",
      "serious_face_with_symbols_covering_mouth"
    ],
    u: "1f92c"
  },
  {
    n: [
      "face with medical mask",
      "mask"
    ],
    u: "1f637"
  },
  {
    n: [
      "face with thermometer",
      "face_with_thermometer"
    ],
    u: "1f912"
  },
  {
    n: [
      "face with head-bandage",
      "face_with_head_bandage"
    ],
    u: "1f915"
  },
  {
    n: [
      "nauseated face",
      "nauseated_face"
    ],
    u: "1f922"
  },
  {
    n: [
      "face with open mouth vomiting",
      "face_vomiting",
      "face_with_open_mouth_vomiting"
    ],
    u: "1f92e"
  },
  {
    n: [
      "sneezing face",
      "sneezing_face"
    ],
    u: "1f927"
  },
  {
    n: [
      "smiling face with halo",
      "innocent"
    ],
    u: "1f607"
  },
  {
    n: [
      "face with cowboy hat",
      "face_with_cowboy_hat"
    ],
    u: "1f920"
  },
  {
    n: [
      "clown face",
      "clown_face"
    ],
    u: "1f921"
  },
  {
    n: [
      "lying face",
      "lying_face"
    ],
    u: "1f925"
  },
  {
    n: [
      "face with finger covering closed lips",
      "shushing_face",
      "face_with_finger_covering_closed_lips"
    ],
    u: "1f92b"
  },
  {
    n: [
      "smiling face with smiling eyes and hand covering mouth",
      "face_with_hand_over_mouth",
      "smiling_face_with_smiling_eyes_and_hand_covering_mouth"
    ],
    u: "1f92d"
  },
  {
    n: [
      "face with monocle",
      "face_with_monocle"
    ],
    u: "1f9d0"
  },
  {
    n: [
      "nerd face",
      "nerd_face"
    ],
    u: "1f913"
  },
  {
    n: [
      "smiling face with horns",
      "smiling_imp"
    ],
    u: "1f608"
  },
  {
    n: [
      "imp"
    ],
    u: "1f47f"
  },
  {
    n: [
      "japanese ogre",
      "japanese_ogre"
    ],
    u: "1f479"
  },
  {
    n: [
      "japanese goblin",
      "japanese_goblin"
    ],
    u: "1f47a"
  },
  {
    n: [
      "skull"
    ],
    u: "1f480"
  },
  {
    n: [
      "skull_and_crossbones"
    ],
    u: "2620-fe0f"
  },
  {
    n: [
      "ghost"
    ],
    u: "1f47b"
  },
  {
    n: [
      "extraterrestrial alien",
      "alien"
    ],
    u: "1f47d"
  },
  {
    n: [
      "alien monster",
      "space_invader"
    ],
    u: "1f47e"
  },
  {
    n: [
      "robot face",
      "robot_face"
    ],
    u: "1f916"
  },
  {
    n: [
      "pile of poo",
      "hankey",
      "poop",
      "shit"
    ],
    u: "1f4a9"
  },
  {
    n: [
      "smiling cat face with open mouth",
      "smiley_cat"
    ],
    u: "1f63a"
  },
  {
    n: [
      "grinning cat face with smiling eyes",
      "smile_cat"
    ],
    u: "1f638"
  },
  {
    n: [
      "cat face with tears of joy",
      "joy_cat"
    ],
    u: "1f639"
  },
  {
    n: [
      "smiling cat face with heart-shaped eyes",
      "heart_eyes_cat"
    ],
    u: "1f63b"
  },
  {
    n: [
      "cat face with wry smile",
      "smirk_cat"
    ],
    u: "1f63c"
  },
  {
    n: [
      "kissing cat face with closed eyes",
      "kissing_cat"
    ],
    u: "1f63d"
  },
  {
    n: [
      "weary cat face",
      "scream_cat"
    ],
    u: "1f640"
  },
  {
    n: [
      "crying cat face",
      "crying_cat_face"
    ],
    u: "1f63f"
  },
  {
    n: [
      "pouting cat face",
      "pouting_cat"
    ],
    u: "1f63e"
  },
  {
    n: [
      "see-no-evil monkey",
      "see_no_evil"
    ],
    u: "1f648"
  },
  {
    n: [
      "hear-no-evil monkey",
      "hear_no_evil"
    ],
    u: "1f649"
  },
  {
    n: [
      "speak-no-evil monkey",
      "speak_no_evil"
    ],
    u: "1f64a"
  },
  {
    n: [
      "baby"
    ],
    u: "1f476",
    v: [
      "1f476-1f3fb",
      "1f476-1f3fc",
      "1f476-1f3fd",
      "1f476-1f3fe",
      "1f476-1f3ff"
    ]
  },
  {
    n: [
      "child"
    ],
    u: "1f9d2",
    v: [
      "1f9d2-1f3fb",
      "1f9d2-1f3fc",
      "1f9d2-1f3fd",
      "1f9d2-1f3fe",
      "1f9d2-1f3ff"
    ]
  },
  {
    n: [
      "boy"
    ],
    u: "1f466",
    v: [
      "1f466-1f3fb",
      "1f466-1f3fc",
      "1f466-1f3fd",
      "1f466-1f3fe",
      "1f466-1f3ff"
    ]
  },
  {
    n: [
      "girl"
    ],
    u: "1f467",
    v: [
      "1f467-1f3fb",
      "1f467-1f3fc",
      "1f467-1f3fd",
      "1f467-1f3fe",
      "1f467-1f3ff"
    ]
  },
  {
    n: [
      "adult"
    ],
    u: "1f9d1",
    v: [
      "1f9d1-1f3fb",
      "1f9d1-1f3fc",
      "1f9d1-1f3fd",
      "1f9d1-1f3fe",
      "1f9d1-1f3ff"
    ]
  },
  {
    n: [
      "man"
    ],
    u: "1f468",
    v: [
      "1f468-1f3fb",
      "1f468-1f3fc",
      "1f468-1f3fd",
      "1f468-1f3fe",
      "1f468-1f3ff"
    ]
  },
  {
    n: [
      "woman"
    ],
    u: "1f469",
    v: [
      "1f469-1f3fb",
      "1f469-1f3fc",
      "1f469-1f3fd",
      "1f469-1f3fe",
      "1f469-1f3ff"
    ]
  },
  {
    n: [
      "older adult",
      "older_adult"
    ],
    u: "1f9d3",
    v: [
      "1f9d3-1f3fb",
      "1f9d3-1f3fc",
      "1f9d3-1f3fd",
      "1f9d3-1f3fe",
      "1f9d3-1f3ff"
    ]
  },
  {
    n: [
      "older man",
      "older_man"
    ],
    u: "1f474",
    v: [
      "1f474-1f3fb",
      "1f474-1f3fc",
      "1f474-1f3fd",
      "1f474-1f3fe",
      "1f474-1f3ff"
    ]
  },
  {
    n: [
      "older woman",
      "older_woman"
    ],
    u: "1f475",
    v: [
      "1f475-1f3fb",
      "1f475-1f3fc",
      "1f475-1f3fd",
      "1f475-1f3fe",
      "1f475-1f3ff"
    ]
  },
  {
    n: [
      "male-doctor"
    ],
    u: "1f468-200d-2695-fe0f",
    v: [
      "1f468-1f3fb-200d-2695-fe0f",
      "1f468-1f3fc-200d-2695-fe0f",
      "1f468-1f3fd-200d-2695-fe0f",
      "1f468-1f3fe-200d-2695-fe0f",
      "1f468-1f3ff-200d-2695-fe0f"
    ]
  },
  {
    n: [
      "female-doctor"
    ],
    u: "1f469-200d-2695-fe0f",
    v: [
      "1f469-1f3fb-200d-2695-fe0f",
      "1f469-1f3fc-200d-2695-fe0f",
      "1f469-1f3fd-200d-2695-fe0f",
      "1f469-1f3fe-200d-2695-fe0f",
      "1f469-1f3ff-200d-2695-fe0f"
    ]
  },
  {
    n: [
      "male-student"
    ],
    u: "1f468-200d-1f393",
    v: [
      "1f468-1f3fb-200d-1f393",
      "1f468-1f3fc-200d-1f393",
      "1f468-1f3fd-200d-1f393",
      "1f468-1f3fe-200d-1f393",
      "1f468-1f3ff-200d-1f393"
    ]
  },
  {
    n: [
      "female-student"
    ],
    u: "1f469-200d-1f393",
    v: [
      "1f469-1f3fb-200d-1f393",
      "1f469-1f3fc-200d-1f393",
      "1f469-1f3fd-200d-1f393",
      "1f469-1f3fe-200d-1f393",
      "1f469-1f3ff-200d-1f393"
    ]
  },
  {
    n: [
      "male-teacher"
    ],
    u: "1f468-200d-1f3eb",
    v: [
      "1f468-1f3fb-200d-1f3eb",
      "1f468-1f3fc-200d-1f3eb",
      "1f468-1f3fd-200d-1f3eb",
      "1f468-1f3fe-200d-1f3eb",
      "1f468-1f3ff-200d-1f3eb"
    ]
  },
  {
    n: [
      "female-teacher"
    ],
    u: "1f469-200d-1f3eb",
    v: [
      "1f469-1f3fb-200d-1f3eb",
      "1f469-1f3fc-200d-1f3eb",
      "1f469-1f3fd-200d-1f3eb",
      "1f469-1f3fe-200d-1f3eb",
      "1f469-1f3ff-200d-1f3eb"
    ]
  },
  {
    n: [
      "male-judge"
    ],
    u: "1f468-200d-2696-fe0f",
    v: [
      "1f468-1f3fb-200d-2696-fe0f",
      "1f468-1f3fc-200d-2696-fe0f",
      "1f468-1f3fd-200d-2696-fe0f",
      "1f468-1f3fe-200d-2696-fe0f",
      "1f468-1f3ff-200d-2696-fe0f"
    ]
  },
  {
    n: [
      "female-judge"
    ],
    u: "1f469-200d-2696-fe0f",
    v: [
      "1f469-1f3fb-200d-2696-fe0f",
      "1f469-1f3fc-200d-2696-fe0f",
      "1f469-1f3fd-200d-2696-fe0f",
      "1f469-1f3fe-200d-2696-fe0f",
      "1f469-1f3ff-200d-2696-fe0f"
    ]
  },
  {
    n: [
      "male-farmer"
    ],
    u: "1f468-200d-1f33e",
    v: [
      "1f468-1f3fb-200d-1f33e",
      "1f468-1f3fc-200d-1f33e",
      "1f468-1f3fd-200d-1f33e",
      "1f468-1f3fe-200d-1f33e",
      "1f468-1f3ff-200d-1f33e"
    ]
  },
  {
    n: [
      "female-farmer"
    ],
    u: "1f469-200d-1f33e",
    v: [
      "1f469-1f3fb-200d-1f33e",
      "1f469-1f3fc-200d-1f33e",
      "1f469-1f3fd-200d-1f33e",
      "1f469-1f3fe-200d-1f33e",
      "1f469-1f3ff-200d-1f33e"
    ]
  },
  {
    n: [
      "male-cook"
    ],
    u: "1f468-200d-1f373",
    v: [
      "1f468-1f3fb-200d-1f373",
      "1f468-1f3fc-200d-1f373",
      "1f468-1f3fd-200d-1f373",
      "1f468-1f3fe-200d-1f373",
      "1f468-1f3ff-200d-1f373"
    ]
  },
  {
    n: [
      "female-cook"
    ],
    u: "1f469-200d-1f373",
    v: [
      "1f469-1f3fb-200d-1f373",
      "1f469-1f3fc-200d-1f373",
      "1f469-1f3fd-200d-1f373",
      "1f469-1f3fe-200d-1f373",
      "1f469-1f3ff-200d-1f373"
    ]
  },
  {
    n: [
      "male-mechanic"
    ],
    u: "1f468-200d-1f527",
    v: [
      "1f468-1f3fb-200d-1f527",
      "1f468-1f3fc-200d-1f527",
      "1f468-1f3fd-200d-1f527",
      "1f468-1f3fe-200d-1f527",
      "1f468-1f3ff-200d-1f527"
    ]
  },
  {
    n: [
      "female-mechanic"
    ],
    u: "1f469-200d-1f527",
    v: [
      "1f469-1f3fb-200d-1f527",
      "1f469-1f3fc-200d-1f527",
      "1f469-1f3fd-200d-1f527",
      "1f469-1f3fe-200d-1f527",
      "1f469-1f3ff-200d-1f527"
    ]
  },
  {
    n: [
      "male-factory-worker"
    ],
    u: "1f468-200d-1f3ed",
    v: [
      "1f468-1f3fb-200d-1f3ed",
      "1f468-1f3fc-200d-1f3ed",
      "1f468-1f3fd-200d-1f3ed",
      "1f468-1f3fe-200d-1f3ed",
      "1f468-1f3ff-200d-1f3ed"
    ]
  },
  {
    n: [
      "female-factory-worker"
    ],
    u: "1f469-200d-1f3ed",
    v: [
      "1f469-1f3fb-200d-1f3ed",
      "1f469-1f3fc-200d-1f3ed",
      "1f469-1f3fd-200d-1f3ed",
      "1f469-1f3fe-200d-1f3ed",
      "1f469-1f3ff-200d-1f3ed"
    ]
  },
  {
    n: [
      "male-office-worker"
    ],
    u: "1f468-200d-1f4bc",
    v: [
      "1f468-1f3fb-200d-1f4bc",
      "1f468-1f3fc-200d-1f4bc",
      "1f468-1f3fd-200d-1f4bc",
      "1f468-1f3fe-200d-1f4bc",
      "1f468-1f3ff-200d-1f4bc"
    ]
  },
  {
    n: [
      "female-office-worker"
    ],
    u: "1f469-200d-1f4bc",
    v: [
      "1f469-1f3fb-200d-1f4bc",
      "1f469-1f3fc-200d-1f4bc",
      "1f469-1f3fd-200d-1f4bc",
      "1f469-1f3fe-200d-1f4bc",
      "1f469-1f3ff-200d-1f4bc"
    ]
  },
  {
    n: [
      "male-scientist"
    ],
    u: "1f468-200d-1f52c",
    v: [
      "1f468-1f3fb-200d-1f52c",
      "1f468-1f3fc-200d-1f52c",
      "1f468-1f3fd-200d-1f52c",
      "1f468-1f3fe-200d-1f52c",
      "1f468-1f3ff-200d-1f52c"
    ]
  },
  {
    n: [
      "female-scientist"
    ],
    u: "1f469-200d-1f52c",
    v: [
      "1f469-1f3fb-200d-1f52c",
      "1f469-1f3fc-200d-1f52c",
      "1f469-1f3fd-200d-1f52c",
      "1f469-1f3fe-200d-1f52c",
      "1f469-1f3ff-200d-1f52c"
    ]
  },
  {
    n: [
      "male-technologist"
    ],
    u: "1f468-200d-1f4bb",
    v: [
      "1f468-1f3fb-200d-1f4bb",
      "1f468-1f3fc-200d-1f4bb",
      "1f468-1f3fd-200d-1f4bb",
      "1f468-1f3fe-200d-1f4bb",
      "1f468-1f3ff-200d-1f4bb"
    ]
  },
  {
    n: [
      "female-technologist"
    ],
    u: "1f469-200d-1f4bb",
    v: [
      "1f469-1f3fb-200d-1f4bb",
      "1f469-1f3fc-200d-1f4bb",
      "1f469-1f3fd-200d-1f4bb",
      "1f469-1f3fe-200d-1f4bb",
      "1f469-1f3ff-200d-1f4bb"
    ]
  },
  {
    n: [
      "male-singer"
    ],
    u: "1f468-200d-1f3a4",
    v: [
      "1f468-1f3fb-200d-1f3a4",
      "1f468-1f3fc-200d-1f3a4",
      "1f468-1f3fd-200d-1f3a4",
      "1f468-1f3fe-200d-1f3a4",
      "1f468-1f3ff-200d-1f3a4"
    ]
  },
  {
    n: [
      "female-singer"
    ],
    u: "1f469-200d-1f3a4",
    v: [
      "1f469-1f3fb-200d-1f3a4",
      "1f469-1f3fc-200d-1f3a4",
      "1f469-1f3fd-200d-1f3a4",
      "1f469-1f3fe-200d-1f3a4",
      "1f469-1f3ff-200d-1f3a4"
    ]
  },
  {
    n: [
      "male-artist"
    ],
    u: "1f468-200d-1f3a8",
    v: [
      "1f468-1f3fb-200d-1f3a8",
      "1f468-1f3fc-200d-1f3a8",
      "1f468-1f3fd-200d-1f3a8",
      "1f468-1f3fe-200d-1f3a8",
      "1f468-1f3ff-200d-1f3a8"
    ]
  },
  {
    n: [
      "female-artist"
    ],
    u: "1f469-200d-1f3a8",
    v: [
      "1f469-1f3fb-200d-1f3a8",
      "1f469-1f3fc-200d-1f3a8",
      "1f469-1f3fd-200d-1f3a8",
      "1f469-1f3fe-200d-1f3a8",
      "1f469-1f3ff-200d-1f3a8"
    ]
  },
  {
    n: [
      "male-pilot"
    ],
    u: "1f468-200d-2708-fe0f",
    v: [
      "1f468-1f3fb-200d-2708-fe0f",
      "1f468-1f3fc-200d-2708-fe0f",
      "1f468-1f3fd-200d-2708-fe0f",
      "1f468-1f3fe-200d-2708-fe0f",
      "1f468-1f3ff-200d-2708-fe0f"
    ]
  },
  {
    n: [
      "female-pilot"
    ],
    u: "1f469-200d-2708-fe0f",
    v: [
      "1f469-1f3fb-200d-2708-fe0f",
      "1f469-1f3fc-200d-2708-fe0f",
      "1f469-1f3fd-200d-2708-fe0f",
      "1f469-1f3fe-200d-2708-fe0f",
      "1f469-1f3ff-200d-2708-fe0f"
    ]
  },
  {
    n: [
      "male-astronaut"
    ],
    u: "1f468-200d-1f680",
    v: [
      "1f468-1f3fb-200d-1f680",
      "1f468-1f3fc-200d-1f680",
      "1f468-1f3fd-200d-1f680",
      "1f468-1f3fe-200d-1f680",
      "1f468-1f3ff-200d-1f680"
    ]
  },
  {
    n: [
      "female-astronaut"
    ],
    u: "1f469-200d-1f680",
    v: [
      "1f469-1f3fb-200d-1f680",
      "1f469-1f3fc-200d-1f680",
      "1f469-1f3fd-200d-1f680",
      "1f469-1f3fe-200d-1f680",
      "1f469-1f3ff-200d-1f680"
    ]
  },
  {
    n: [
      "male-firefighter"
    ],
    u: "1f468-200d-1f692",
    v: [
      "1f468-1f3fb-200d-1f692",
      "1f468-1f3fc-200d-1f692",
      "1f468-1f3fd-200d-1f692",
      "1f468-1f3fe-200d-1f692",
      "1f468-1f3ff-200d-1f692"
    ]
  },
  {
    n: [
      "female-firefighter"
    ],
    u: "1f469-200d-1f692",
    v: [
      "1f469-1f3fb-200d-1f692",
      "1f469-1f3fc-200d-1f692",
      "1f469-1f3fd-200d-1f692",
      "1f469-1f3fe-200d-1f692",
      "1f469-1f3ff-200d-1f692"
    ]
  },
  {
    n: [
      "police officer",
      "cop"
    ],
    u: "1f46e",
    v: [
      "1f46e-1f3fb",
      "1f46e-1f3fc",
      "1f46e-1f3fd",
      "1f46e-1f3fe",
      "1f46e-1f3ff"
    ]
  },
  {
    n: [
      "male-police-officer"
    ],
    u: "1f46e-200d-2642-fe0f",
    v: [
      "1f46e-1f3fb-200d-2642-fe0f",
      "1f46e-1f3fc-200d-2642-fe0f",
      "1f46e-1f3fd-200d-2642-fe0f",
      "1f46e-1f3fe-200d-2642-fe0f",
      "1f46e-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "female-police-officer"
    ],
    u: "1f46e-200d-2640-fe0f",
    v: [
      "1f46e-1f3fb-200d-2640-fe0f",
      "1f46e-1f3fc-200d-2640-fe0f",
      "1f46e-1f3fd-200d-2640-fe0f",
      "1f46e-1f3fe-200d-2640-fe0f",
      "1f46e-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "sleuth_or_spy"
    ],
    u: "1f575-fe0f",
    v: [
      "1f575-1f3fb",
      "1f575-1f3fc",
      "1f575-1f3fd",
      "1f575-1f3fe",
      "1f575-1f3ff"
    ]
  },
  {
    n: [
      "male-detective"
    ],
    u: "1f575-fe0f-200d-2642-fe0f",
    v: [
      "1f575-1f3fb-200d-2642-fe0f",
      "1f575-1f3fc-200d-2642-fe0f",
      "1f575-1f3fd-200d-2642-fe0f",
      "1f575-1f3fe-200d-2642-fe0f",
      "1f575-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "female-detective"
    ],
    u: "1f575-fe0f-200d-2640-fe0f",
    v: [
      "1f575-1f3fb-200d-2640-fe0f",
      "1f575-1f3fc-200d-2640-fe0f",
      "1f575-1f3fd-200d-2640-fe0f",
      "1f575-1f3fe-200d-2640-fe0f",
      "1f575-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "guardsman"
    ],
    u: "1f482",
    v: [
      "1f482-1f3fb",
      "1f482-1f3fc",
      "1f482-1f3fd",
      "1f482-1f3fe",
      "1f482-1f3ff"
    ]
  },
  {
    n: [
      "male-guard"
    ],
    u: "1f482-200d-2642-fe0f",
    v: [
      "1f482-1f3fb-200d-2642-fe0f",
      "1f482-1f3fc-200d-2642-fe0f",
      "1f482-1f3fd-200d-2642-fe0f",
      "1f482-1f3fe-200d-2642-fe0f",
      "1f482-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "female-guard"
    ],
    u: "1f482-200d-2640-fe0f",
    v: [
      "1f482-1f3fb-200d-2640-fe0f",
      "1f482-1f3fc-200d-2640-fe0f",
      "1f482-1f3fd-200d-2640-fe0f",
      "1f482-1f3fe-200d-2640-fe0f",
      "1f482-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "construction worker",
      "construction_worker"
    ],
    u: "1f477",
    v: [
      "1f477-1f3fb",
      "1f477-1f3fc",
      "1f477-1f3fd",
      "1f477-1f3fe",
      "1f477-1f3ff"
    ]
  },
  {
    n: [
      "male-construction-worker"
    ],
    u: "1f477-200d-2642-fe0f",
    v: [
      "1f477-1f3fb-200d-2642-fe0f",
      "1f477-1f3fc-200d-2642-fe0f",
      "1f477-1f3fd-200d-2642-fe0f",
      "1f477-1f3fe-200d-2642-fe0f",
      "1f477-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "female-construction-worker"
    ],
    u: "1f477-200d-2640-fe0f",
    v: [
      "1f477-1f3fb-200d-2640-fe0f",
      "1f477-1f3fc-200d-2640-fe0f",
      "1f477-1f3fd-200d-2640-fe0f",
      "1f477-1f3fe-200d-2640-fe0f",
      "1f477-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "prince"
    ],
    u: "1f934",
    v: [
      "1f934-1f3fb",
      "1f934-1f3fc",
      "1f934-1f3fd",
      "1f934-1f3fe",
      "1f934-1f3ff"
    ]
  },
  {
    n: [
      "princess"
    ],
    u: "1f478",
    v: [
      "1f478-1f3fb",
      "1f478-1f3fc",
      "1f478-1f3fd",
      "1f478-1f3fe",
      "1f478-1f3ff"
    ]
  },
  {
    n: [
      "man with turban",
      "man_with_turban"
    ],
    u: "1f473",
    v: [
      "1f473-1f3fb",
      "1f473-1f3fc",
      "1f473-1f3fd",
      "1f473-1f3fe",
      "1f473-1f3ff"
    ]
  },
  {
    n: [
      "man-wearing-turban"
    ],
    u: "1f473-200d-2642-fe0f",
    v: [
      "1f473-1f3fb-200d-2642-fe0f",
      "1f473-1f3fc-200d-2642-fe0f",
      "1f473-1f3fd-200d-2642-fe0f",
      "1f473-1f3fe-200d-2642-fe0f",
      "1f473-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-wearing-turban"
    ],
    u: "1f473-200d-2640-fe0f",
    v: [
      "1f473-1f3fb-200d-2640-fe0f",
      "1f473-1f3fc-200d-2640-fe0f",
      "1f473-1f3fd-200d-2640-fe0f",
      "1f473-1f3fe-200d-2640-fe0f",
      "1f473-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "man with gua pi mao",
      "man_with_gua_pi_mao"
    ],
    u: "1f472",
    v: [
      "1f472-1f3fb",
      "1f472-1f3fc",
      "1f472-1f3fd",
      "1f472-1f3fe",
      "1f472-1f3ff"
    ]
  },
  {
    n: [
      "person with headscarf",
      "person_with_headscarf"
    ],
    u: "1f9d5",
    v: [
      "1f9d5-1f3fb",
      "1f9d5-1f3fc",
      "1f9d5-1f3fd",
      "1f9d5-1f3fe",
      "1f9d5-1f3ff"
    ]
  },
  {
    n: [
      "bearded person",
      "bearded_person"
    ],
    u: "1f9d4",
    v: [
      "1f9d4-1f3fb",
      "1f9d4-1f3fc",
      "1f9d4-1f3fd",
      "1f9d4-1f3fe",
      "1f9d4-1f3ff"
    ]
  },
  {
    n: [
      "person with blond hair",
      "person_with_blond_hair"
    ],
    u: "1f471",
    v: [
      "1f471-1f3fb",
      "1f471-1f3fc",
      "1f471-1f3fd",
      "1f471-1f3fe",
      "1f471-1f3ff"
    ]
  },
  {
    n: [
      "blond-haired-man"
    ],
    u: "1f471-200d-2642-fe0f",
    v: [
      "1f471-1f3fb-200d-2642-fe0f",
      "1f471-1f3fc-200d-2642-fe0f",
      "1f471-1f3fd-200d-2642-fe0f",
      "1f471-1f3fe-200d-2642-fe0f",
      "1f471-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "blond-haired-woman"
    ],
    u: "1f471-200d-2640-fe0f",
    v: [
      "1f471-1f3fb-200d-2640-fe0f",
      "1f471-1f3fc-200d-2640-fe0f",
      "1f471-1f3fd-200d-2640-fe0f",
      "1f471-1f3fe-200d-2640-fe0f",
      "1f471-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "man in tuxedo",
      "man_in_tuxedo"
    ],
    u: "1f935",
    v: [
      "1f935-1f3fb",
      "1f935-1f3fc",
      "1f935-1f3fd",
      "1f935-1f3fe",
      "1f935-1f3ff"
    ]
  },
  {
    n: [
      "bride with veil",
      "bride_with_veil"
    ],
    u: "1f470",
    v: [
      "1f470-1f3fb",
      "1f470-1f3fc",
      "1f470-1f3fd",
      "1f470-1f3fe",
      "1f470-1f3ff"
    ]
  },
  {
    n: [
      "pregnant woman",
      "pregnant_woman"
    ],
    u: "1f930",
    v: [
      "1f930-1f3fb",
      "1f930-1f3fc",
      "1f930-1f3fd",
      "1f930-1f3fe",
      "1f930-1f3ff"
    ]
  },
  {
    n: [
      "breast-feeding"
    ],
    u: "1f931",
    v: [
      "1f931-1f3fb",
      "1f931-1f3fc",
      "1f931-1f3fd",
      "1f931-1f3fe",
      "1f931-1f3ff"
    ]
  },
  {
    n: [
      "baby angel",
      "angel"
    ],
    u: "1f47c",
    v: [
      "1f47c-1f3fb",
      "1f47c-1f3fc",
      "1f47c-1f3fd",
      "1f47c-1f3fe",
      "1f47c-1f3ff"
    ]
  },
  {
    n: [
      "father christmas",
      "santa"
    ],
    u: "1f385",
    v: [
      "1f385-1f3fb",
      "1f385-1f3fc",
      "1f385-1f3fd",
      "1f385-1f3fe",
      "1f385-1f3ff"
    ]
  },
  {
    n: [
      "mother christmas",
      "mrs_claus",
      "mother_christmas"
    ],
    u: "1f936",
    v: [
      "1f936-1f3fb",
      "1f936-1f3fc",
      "1f936-1f3fd",
      "1f936-1f3fe",
      "1f936-1f3ff"
    ]
  },
  {
    n: [
      "mage"
    ],
    u: "1f9d9",
    v: [
      "1f9d9-1f3fb",
      "1f9d9-1f3fc",
      "1f9d9-1f3fd",
      "1f9d9-1f3fe",
      "1f9d9-1f3ff"
    ]
  },
  {
    n: [
      "female_mage"
    ],
    u: "1f9d9-200d-2640-fe0f",
    v: [
      "1f9d9-1f3fb-200d-2640-fe0f",
      "1f9d9-1f3fc-200d-2640-fe0f",
      "1f9d9-1f3fd-200d-2640-fe0f",
      "1f9d9-1f3fe-200d-2640-fe0f",
      "1f9d9-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "male_mage"
    ],
    u: "1f9d9-200d-2642-fe0f",
    v: [
      "1f9d9-1f3fb-200d-2642-fe0f",
      "1f9d9-1f3fc-200d-2642-fe0f",
      "1f9d9-1f3fd-200d-2642-fe0f",
      "1f9d9-1f3fe-200d-2642-fe0f",
      "1f9d9-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "fairy"
    ],
    u: "1f9da",
    v: [
      "1f9da-1f3fb",
      "1f9da-1f3fc",
      "1f9da-1f3fd",
      "1f9da-1f3fe",
      "1f9da-1f3ff"
    ]
  },
  {
    n: [
      "female_fairy"
    ],
    u: "1f9da-200d-2640-fe0f",
    v: [
      "1f9da-1f3fb-200d-2640-fe0f",
      "1f9da-1f3fc-200d-2640-fe0f",
      "1f9da-1f3fd-200d-2640-fe0f",
      "1f9da-1f3fe-200d-2640-fe0f",
      "1f9da-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "male_fairy"
    ],
    u: "1f9da-200d-2642-fe0f",
    v: [
      "1f9da-1f3fb-200d-2642-fe0f",
      "1f9da-1f3fc-200d-2642-fe0f",
      "1f9da-1f3fd-200d-2642-fe0f",
      "1f9da-1f3fe-200d-2642-fe0f",
      "1f9da-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "vampire"
    ],
    u: "1f9db",
    v: [
      "1f9db-1f3fb",
      "1f9db-1f3fc",
      "1f9db-1f3fd",
      "1f9db-1f3fe",
      "1f9db-1f3ff"
    ]
  },
  {
    n: [
      "female_vampire"
    ],
    u: "1f9db-200d-2640-fe0f",
    v: [
      "1f9db-1f3fb-200d-2640-fe0f",
      "1f9db-1f3fc-200d-2640-fe0f",
      "1f9db-1f3fd-200d-2640-fe0f",
      "1f9db-1f3fe-200d-2640-fe0f",
      "1f9db-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "male_vampire"
    ],
    u: "1f9db-200d-2642-fe0f",
    v: [
      "1f9db-1f3fb-200d-2642-fe0f",
      "1f9db-1f3fc-200d-2642-fe0f",
      "1f9db-1f3fd-200d-2642-fe0f",
      "1f9db-1f3fe-200d-2642-fe0f",
      "1f9db-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "merperson"
    ],
    u: "1f9dc",
    v: [
      "1f9dc-1f3fb",
      "1f9dc-1f3fc",
      "1f9dc-1f3fd",
      "1f9dc-1f3fe",
      "1f9dc-1f3ff"
    ]
  },
  {
    n: [
      "mermaid"
    ],
    u: "1f9dc-200d-2640-fe0f",
    v: [
      "1f9dc-1f3fb-200d-2640-fe0f",
      "1f9dc-1f3fc-200d-2640-fe0f",
      "1f9dc-1f3fd-200d-2640-fe0f",
      "1f9dc-1f3fe-200d-2640-fe0f",
      "1f9dc-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "merman"
    ],
    u: "1f9dc-200d-2642-fe0f",
    v: [
      "1f9dc-1f3fb-200d-2642-fe0f",
      "1f9dc-1f3fc-200d-2642-fe0f",
      "1f9dc-1f3fd-200d-2642-fe0f",
      "1f9dc-1f3fe-200d-2642-fe0f",
      "1f9dc-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "elf"
    ],
    u: "1f9dd",
    v: [
      "1f9dd-1f3fb",
      "1f9dd-1f3fc",
      "1f9dd-1f3fd",
      "1f9dd-1f3fe",
      "1f9dd-1f3ff"
    ]
  },
  {
    n: [
      "female_elf"
    ],
    u: "1f9dd-200d-2640-fe0f",
    v: [
      "1f9dd-1f3fb-200d-2640-fe0f",
      "1f9dd-1f3fc-200d-2640-fe0f",
      "1f9dd-1f3fd-200d-2640-fe0f",
      "1f9dd-1f3fe-200d-2640-fe0f",
      "1f9dd-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "male_elf"
    ],
    u: "1f9dd-200d-2642-fe0f",
    v: [
      "1f9dd-1f3fb-200d-2642-fe0f",
      "1f9dd-1f3fc-200d-2642-fe0f",
      "1f9dd-1f3fd-200d-2642-fe0f",
      "1f9dd-1f3fe-200d-2642-fe0f",
      "1f9dd-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "genie"
    ],
    u: "1f9de"
  },
  {
    n: [
      "female_genie"
    ],
    u: "1f9de-200d-2640-fe0f"
  },
  {
    n: [
      "male_genie"
    ],
    u: "1f9de-200d-2642-fe0f"
  },
  {
    n: [
      "zombie"
    ],
    u: "1f9df"
  },
  {
    n: [
      "female_zombie"
    ],
    u: "1f9df-200d-2640-fe0f"
  },
  {
    n: [
      "male_zombie"
    ],
    u: "1f9df-200d-2642-fe0f"
  },
  {
    n: [
      "person frowning",
      "person_frowning"
    ],
    u: "1f64d",
    v: [
      "1f64d-1f3fb",
      "1f64d-1f3fc",
      "1f64d-1f3fd",
      "1f64d-1f3fe",
      "1f64d-1f3ff"
    ]
  },
  {
    n: [
      "man-frowning"
    ],
    u: "1f64d-200d-2642-fe0f",
    v: [
      "1f64d-1f3fb-200d-2642-fe0f",
      "1f64d-1f3fc-200d-2642-fe0f",
      "1f64d-1f3fd-200d-2642-fe0f",
      "1f64d-1f3fe-200d-2642-fe0f",
      "1f64d-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-frowning"
    ],
    u: "1f64d-200d-2640-fe0f",
    v: [
      "1f64d-1f3fb-200d-2640-fe0f",
      "1f64d-1f3fc-200d-2640-fe0f",
      "1f64d-1f3fd-200d-2640-fe0f",
      "1f64d-1f3fe-200d-2640-fe0f",
      "1f64d-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "person with pouting face",
      "person_with_pouting_face"
    ],
    u: "1f64e",
    v: [
      "1f64e-1f3fb",
      "1f64e-1f3fc",
      "1f64e-1f3fd",
      "1f64e-1f3fe",
      "1f64e-1f3ff"
    ]
  },
  {
    n: [
      "man-pouting"
    ],
    u: "1f64e-200d-2642-fe0f",
    v: [
      "1f64e-1f3fb-200d-2642-fe0f",
      "1f64e-1f3fc-200d-2642-fe0f",
      "1f64e-1f3fd-200d-2642-fe0f",
      "1f64e-1f3fe-200d-2642-fe0f",
      "1f64e-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-pouting"
    ],
    u: "1f64e-200d-2640-fe0f",
    v: [
      "1f64e-1f3fb-200d-2640-fe0f",
      "1f64e-1f3fc-200d-2640-fe0f",
      "1f64e-1f3fd-200d-2640-fe0f",
      "1f64e-1f3fe-200d-2640-fe0f",
      "1f64e-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "face with no good gesture",
      "no_good"
    ],
    u: "1f645",
    v: [
      "1f645-1f3fb",
      "1f645-1f3fc",
      "1f645-1f3fd",
      "1f645-1f3fe",
      "1f645-1f3ff"
    ]
  },
  {
    n: [
      "man-gesturing-no"
    ],
    u: "1f645-200d-2642-fe0f",
    v: [
      "1f645-1f3fb-200d-2642-fe0f",
      "1f645-1f3fc-200d-2642-fe0f",
      "1f645-1f3fd-200d-2642-fe0f",
      "1f645-1f3fe-200d-2642-fe0f",
      "1f645-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-gesturing-no"
    ],
    u: "1f645-200d-2640-fe0f",
    v: [
      "1f645-1f3fb-200d-2640-fe0f",
      "1f645-1f3fc-200d-2640-fe0f",
      "1f645-1f3fd-200d-2640-fe0f",
      "1f645-1f3fe-200d-2640-fe0f",
      "1f645-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "face with ok gesture",
      "ok_woman"
    ],
    u: "1f646",
    v: [
      "1f646-1f3fb",
      "1f646-1f3fc",
      "1f646-1f3fd",
      "1f646-1f3fe",
      "1f646-1f3ff"
    ]
  },
  {
    n: [
      "man-gesturing-ok"
    ],
    u: "1f646-200d-2642-fe0f",
    v: [
      "1f646-1f3fb-200d-2642-fe0f",
      "1f646-1f3fc-200d-2642-fe0f",
      "1f646-1f3fd-200d-2642-fe0f",
      "1f646-1f3fe-200d-2642-fe0f",
      "1f646-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-gesturing-ok"
    ],
    u: "1f646-200d-2640-fe0f",
    v: [
      "1f646-1f3fb-200d-2640-fe0f",
      "1f646-1f3fc-200d-2640-fe0f",
      "1f646-1f3fd-200d-2640-fe0f",
      "1f646-1f3fe-200d-2640-fe0f",
      "1f646-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "information desk person",
      "information_desk_person"
    ],
    u: "1f481",
    v: [
      "1f481-1f3fb",
      "1f481-1f3fc",
      "1f481-1f3fd",
      "1f481-1f3fe",
      "1f481-1f3ff"
    ]
  },
  {
    n: [
      "man-tipping-hand"
    ],
    u: "1f481-200d-2642-fe0f",
    v: [
      "1f481-1f3fb-200d-2642-fe0f",
      "1f481-1f3fc-200d-2642-fe0f",
      "1f481-1f3fd-200d-2642-fe0f",
      "1f481-1f3fe-200d-2642-fe0f",
      "1f481-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-tipping-hand"
    ],
    u: "1f481-200d-2640-fe0f",
    v: [
      "1f481-1f3fb-200d-2640-fe0f",
      "1f481-1f3fc-200d-2640-fe0f",
      "1f481-1f3fd-200d-2640-fe0f",
      "1f481-1f3fe-200d-2640-fe0f",
      "1f481-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "happy person raising one hand",
      "raising_hand"
    ],
    u: "1f64b",
    v: [
      "1f64b-1f3fb",
      "1f64b-1f3fc",
      "1f64b-1f3fd",
      "1f64b-1f3fe",
      "1f64b-1f3ff"
    ]
  },
  {
    n: [
      "man-raising-hand"
    ],
    u: "1f64b-200d-2642-fe0f",
    v: [
      "1f64b-1f3fb-200d-2642-fe0f",
      "1f64b-1f3fc-200d-2642-fe0f",
      "1f64b-1f3fd-200d-2642-fe0f",
      "1f64b-1f3fe-200d-2642-fe0f",
      "1f64b-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-raising-hand"
    ],
    u: "1f64b-200d-2640-fe0f",
    v: [
      "1f64b-1f3fb-200d-2640-fe0f",
      "1f64b-1f3fc-200d-2640-fe0f",
      "1f64b-1f3fd-200d-2640-fe0f",
      "1f64b-1f3fe-200d-2640-fe0f",
      "1f64b-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "person bowing deeply",
      "bow"
    ],
    u: "1f647",
    v: [
      "1f647-1f3fb",
      "1f647-1f3fc",
      "1f647-1f3fd",
      "1f647-1f3fe",
      "1f647-1f3ff"
    ]
  },
  {
    n: [
      "man-bowing"
    ],
    u: "1f647-200d-2642-fe0f",
    v: [
      "1f647-1f3fb-200d-2642-fe0f",
      "1f647-1f3fc-200d-2642-fe0f",
      "1f647-1f3fd-200d-2642-fe0f",
      "1f647-1f3fe-200d-2642-fe0f",
      "1f647-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-bowing"
    ],
    u: "1f647-200d-2640-fe0f",
    v: [
      "1f647-1f3fb-200d-2640-fe0f",
      "1f647-1f3fc-200d-2640-fe0f",
      "1f647-1f3fd-200d-2640-fe0f",
      "1f647-1f3fe-200d-2640-fe0f",
      "1f647-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "face palm",
      "face_palm"
    ],
    u: "1f926",
    v: [
      "1f926-1f3fb",
      "1f926-1f3fc",
      "1f926-1f3fd",
      "1f926-1f3fe",
      "1f926-1f3ff"
    ]
  },
  {
    n: [
      "man-facepalming"
    ],
    u: "1f926-200d-2642-fe0f",
    v: [
      "1f926-1f3fb-200d-2642-fe0f",
      "1f926-1f3fc-200d-2642-fe0f",
      "1f926-1f3fd-200d-2642-fe0f",
      "1f926-1f3fe-200d-2642-fe0f",
      "1f926-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-facepalming"
    ],
    u: "1f926-200d-2640-fe0f",
    v: [
      "1f926-1f3fb-200d-2640-fe0f",
      "1f926-1f3fc-200d-2640-fe0f",
      "1f926-1f3fd-200d-2640-fe0f",
      "1f926-1f3fe-200d-2640-fe0f",
      "1f926-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "shrug"
    ],
    u: "1f937",
    v: [
      "1f937-1f3fb",
      "1f937-1f3fc",
      "1f937-1f3fd",
      "1f937-1f3fe",
      "1f937-1f3ff"
    ]
  },
  {
    n: [
      "man-shrugging"
    ],
    u: "1f937-200d-2642-fe0f",
    v: [
      "1f937-1f3fb-200d-2642-fe0f",
      "1f937-1f3fc-200d-2642-fe0f",
      "1f937-1f3fd-200d-2642-fe0f",
      "1f937-1f3fe-200d-2642-fe0f",
      "1f937-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-shrugging"
    ],
    u: "1f937-200d-2640-fe0f",
    v: [
      "1f937-1f3fb-200d-2640-fe0f",
      "1f937-1f3fc-200d-2640-fe0f",
      "1f937-1f3fd-200d-2640-fe0f",
      "1f937-1f3fe-200d-2640-fe0f",
      "1f937-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "face massage",
      "massage"
    ],
    u: "1f486",
    v: [
      "1f486-1f3fb",
      "1f486-1f3fc",
      "1f486-1f3fd",
      "1f486-1f3fe",
      "1f486-1f3ff"
    ]
  },
  {
    n: [
      "man-getting-massage"
    ],
    u: "1f486-200d-2642-fe0f",
    v: [
      "1f486-1f3fb-200d-2642-fe0f",
      "1f486-1f3fc-200d-2642-fe0f",
      "1f486-1f3fd-200d-2642-fe0f",
      "1f486-1f3fe-200d-2642-fe0f",
      "1f486-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-getting-massage"
    ],
    u: "1f486-200d-2640-fe0f",
    v: [
      "1f486-1f3fb-200d-2640-fe0f",
      "1f486-1f3fc-200d-2640-fe0f",
      "1f486-1f3fd-200d-2640-fe0f",
      "1f486-1f3fe-200d-2640-fe0f",
      "1f486-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "haircut"
    ],
    u: "1f487",
    v: [
      "1f487-1f3fb",
      "1f487-1f3fc",
      "1f487-1f3fd",
      "1f487-1f3fe",
      "1f487-1f3ff"
    ]
  },
  {
    n: [
      "man-getting-haircut"
    ],
    u: "1f487-200d-2642-fe0f",
    v: [
      "1f487-1f3fb-200d-2642-fe0f",
      "1f487-1f3fc-200d-2642-fe0f",
      "1f487-1f3fd-200d-2642-fe0f",
      "1f487-1f3fe-200d-2642-fe0f",
      "1f487-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-getting-haircut"
    ],
    u: "1f487-200d-2640-fe0f",
    v: [
      "1f487-1f3fb-200d-2640-fe0f",
      "1f487-1f3fc-200d-2640-fe0f",
      "1f487-1f3fd-200d-2640-fe0f",
      "1f487-1f3fe-200d-2640-fe0f",
      "1f487-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "pedestrian",
      "walking"
    ],
    u: "1f6b6",
    v: [
      "1f6b6-1f3fb",
      "1f6b6-1f3fc",
      "1f6b6-1f3fd",
      "1f6b6-1f3fe",
      "1f6b6-1f3ff"
    ]
  },
  {
    n: [
      "man-walking"
    ],
    u: "1f6b6-200d-2642-fe0f",
    v: [
      "1f6b6-1f3fb-200d-2642-fe0f",
      "1f6b6-1f3fc-200d-2642-fe0f",
      "1f6b6-1f3fd-200d-2642-fe0f",
      "1f6b6-1f3fe-200d-2642-fe0f",
      "1f6b6-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-walking"
    ],
    u: "1f6b6-200d-2640-fe0f",
    v: [
      "1f6b6-1f3fb-200d-2640-fe0f",
      "1f6b6-1f3fc-200d-2640-fe0f",
      "1f6b6-1f3fd-200d-2640-fe0f",
      "1f6b6-1f3fe-200d-2640-fe0f",
      "1f6b6-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "runner",
      "running"
    ],
    u: "1f3c3",
    v: [
      "1f3c3-1f3fb",
      "1f3c3-1f3fc",
      "1f3c3-1f3fd",
      "1f3c3-1f3fe",
      "1f3c3-1f3ff"
    ]
  },
  {
    n: [
      "man-running"
    ],
    u: "1f3c3-200d-2642-fe0f",
    v: [
      "1f3c3-1f3fb-200d-2642-fe0f",
      "1f3c3-1f3fc-200d-2642-fe0f",
      "1f3c3-1f3fd-200d-2642-fe0f",
      "1f3c3-1f3fe-200d-2642-fe0f",
      "1f3c3-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-running"
    ],
    u: "1f3c3-200d-2640-fe0f",
    v: [
      "1f3c3-1f3fb-200d-2640-fe0f",
      "1f3c3-1f3fc-200d-2640-fe0f",
      "1f3c3-1f3fd-200d-2640-fe0f",
      "1f3c3-1f3fe-200d-2640-fe0f",
      "1f3c3-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "dancer"
    ],
    u: "1f483",
    v: [
      "1f483-1f3fb",
      "1f483-1f3fc",
      "1f483-1f3fd",
      "1f483-1f3fe",
      "1f483-1f3ff"
    ]
  },
  {
    n: [
      "man dancing",
      "man_dancing"
    ],
    u: "1f57a",
    v: [
      "1f57a-1f3fb",
      "1f57a-1f3fc",
      "1f57a-1f3fd",
      "1f57a-1f3fe",
      "1f57a-1f3ff"
    ]
  },
  {
    n: [
      "woman with bunny ears",
      "dancers"
    ],
    u: "1f46f"
  },
  {
    n: [
      "man-with-bunny-ears-partying"
    ],
    u: "1f46f-200d-2642-fe0f"
  },
  {
    n: [
      "woman-with-bunny-ears-partying"
    ],
    u: "1f46f-200d-2640-fe0f"
  },
  {
    n: [
      "person in steamy room",
      "person_in_steamy_room"
    ],
    u: "1f9d6",
    v: [
      "1f9d6-1f3fb",
      "1f9d6-1f3fc",
      "1f9d6-1f3fd",
      "1f9d6-1f3fe",
      "1f9d6-1f3ff"
    ]
  },
  {
    n: [
      "woman_in_steamy_room"
    ],
    u: "1f9d6-200d-2640-fe0f",
    v: [
      "1f9d6-1f3fb-200d-2640-fe0f",
      "1f9d6-1f3fc-200d-2640-fe0f",
      "1f9d6-1f3fd-200d-2640-fe0f",
      "1f9d6-1f3fe-200d-2640-fe0f",
      "1f9d6-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "man_in_steamy_room"
    ],
    u: "1f9d6-200d-2642-fe0f",
    v: [
      "1f9d6-1f3fb-200d-2642-fe0f",
      "1f9d6-1f3fc-200d-2642-fe0f",
      "1f9d6-1f3fd-200d-2642-fe0f",
      "1f9d6-1f3fe-200d-2642-fe0f",
      "1f9d6-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "person climbing",
      "person_climbing"
    ],
    u: "1f9d7",
    v: [
      "1f9d7-1f3fb",
      "1f9d7-1f3fc",
      "1f9d7-1f3fd",
      "1f9d7-1f3fe",
      "1f9d7-1f3ff"
    ]
  },
  {
    n: [
      "woman_climbing"
    ],
    u: "1f9d7-200d-2640-fe0f",
    v: [
      "1f9d7-1f3fb-200d-2640-fe0f",
      "1f9d7-1f3fc-200d-2640-fe0f",
      "1f9d7-1f3fd-200d-2640-fe0f",
      "1f9d7-1f3fe-200d-2640-fe0f",
      "1f9d7-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "man_climbing"
    ],
    u: "1f9d7-200d-2642-fe0f",
    v: [
      "1f9d7-1f3fb-200d-2642-fe0f",
      "1f9d7-1f3fc-200d-2642-fe0f",
      "1f9d7-1f3fd-200d-2642-fe0f",
      "1f9d7-1f3fe-200d-2642-fe0f",
      "1f9d7-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "person in lotus position",
      "person_in_lotus_position"
    ],
    u: "1f9d8",
    v: [
      "1f9d8-1f3fb",
      "1f9d8-1f3fc",
      "1f9d8-1f3fd",
      "1f9d8-1f3fe",
      "1f9d8-1f3ff"
    ]
  },
  {
    n: [
      "woman_in_lotus_position"
    ],
    u: "1f9d8-200d-2640-fe0f",
    v: [
      "1f9d8-1f3fb-200d-2640-fe0f",
      "1f9d8-1f3fc-200d-2640-fe0f",
      "1f9d8-1f3fd-200d-2640-fe0f",
      "1f9d8-1f3fe-200d-2640-fe0f",
      "1f9d8-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "man_in_lotus_position"
    ],
    u: "1f9d8-200d-2642-fe0f",
    v: [
      "1f9d8-1f3fb-200d-2642-fe0f",
      "1f9d8-1f3fc-200d-2642-fe0f",
      "1f9d8-1f3fd-200d-2642-fe0f",
      "1f9d8-1f3fe-200d-2642-fe0f",
      "1f9d8-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "bath"
    ],
    u: "1f6c0",
    v: [
      "1f6c0-1f3fb",
      "1f6c0-1f3fc",
      "1f6c0-1f3fd",
      "1f6c0-1f3fe",
      "1f6c0-1f3ff"
    ]
  },
  {
    n: [
      "sleeping accommodation",
      "sleeping_accommodation"
    ],
    u: "1f6cc",
    v: [
      "1f6cc-1f3fb",
      "1f6cc-1f3fc",
      "1f6cc-1f3fd",
      "1f6cc-1f3fe",
      "1f6cc-1f3ff"
    ]
  },
  {
    n: [
      "man_in_business_suit_levitating"
    ],
    u: "1f574-fe0f",
    v: [
      "1f574-1f3fb",
      "1f574-1f3fc",
      "1f574-1f3fd",
      "1f574-1f3fe",
      "1f574-1f3ff"
    ]
  },
  {
    n: [
      "speaking_head_in_silhouette"
    ],
    u: "1f5e3-fe0f"
  },
  {
    n: [
      "bust in silhouette",
      "bust_in_silhouette"
    ],
    u: "1f464"
  },
  {
    n: [
      "busts in silhouette",
      "busts_in_silhouette"
    ],
    u: "1f465"
  },
  {
    n: [
      "fencer"
    ],
    u: "1f93a"
  },
  {
    n: [
      "horse racing",
      "horse_racing"
    ],
    u: "1f3c7",
    v: [
      "1f3c7-1f3fb",
      "1f3c7-1f3fc",
      "1f3c7-1f3fd",
      "1f3c7-1f3fe",
      "1f3c7-1f3ff"
    ]
  },
  {
    n: [
      "skier"
    ],
    u: "26f7-fe0f"
  },
  {
    n: [
      "snowboarder"
    ],
    u: "1f3c2",
    v: [
      "1f3c2-1f3fb",
      "1f3c2-1f3fc",
      "1f3c2-1f3fd",
      "1f3c2-1f3fe",
      "1f3c2-1f3ff"
    ]
  },
  {
    n: [
      "golfer"
    ],
    u: "1f3cc-fe0f",
    v: [
      "1f3cc-1f3fb",
      "1f3cc-1f3fc",
      "1f3cc-1f3fd",
      "1f3cc-1f3fe",
      "1f3cc-1f3ff"
    ]
  },
  {
    n: [
      "man-golfing"
    ],
    u: "1f3cc-fe0f-200d-2642-fe0f",
    v: [
      "1f3cc-1f3fb-200d-2642-fe0f",
      "1f3cc-1f3fc-200d-2642-fe0f",
      "1f3cc-1f3fd-200d-2642-fe0f",
      "1f3cc-1f3fe-200d-2642-fe0f",
      "1f3cc-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-golfing"
    ],
    u: "1f3cc-fe0f-200d-2640-fe0f",
    v: [
      "1f3cc-1f3fb-200d-2640-fe0f",
      "1f3cc-1f3fc-200d-2640-fe0f",
      "1f3cc-1f3fd-200d-2640-fe0f",
      "1f3cc-1f3fe-200d-2640-fe0f",
      "1f3cc-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "surfer"
    ],
    u: "1f3c4",
    v: [
      "1f3c4-1f3fb",
      "1f3c4-1f3fc",
      "1f3c4-1f3fd",
      "1f3c4-1f3fe",
      "1f3c4-1f3ff"
    ]
  },
  {
    n: [
      "man-surfing"
    ],
    u: "1f3c4-200d-2642-fe0f",
    v: [
      "1f3c4-1f3fb-200d-2642-fe0f",
      "1f3c4-1f3fc-200d-2642-fe0f",
      "1f3c4-1f3fd-200d-2642-fe0f",
      "1f3c4-1f3fe-200d-2642-fe0f",
      "1f3c4-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-surfing"
    ],
    u: "1f3c4-200d-2640-fe0f",
    v: [
      "1f3c4-1f3fb-200d-2640-fe0f",
      "1f3c4-1f3fc-200d-2640-fe0f",
      "1f3c4-1f3fd-200d-2640-fe0f",
      "1f3c4-1f3fe-200d-2640-fe0f",
      "1f3c4-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "rowboat"
    ],
    u: "1f6a3",
    v: [
      "1f6a3-1f3fb",
      "1f6a3-1f3fc",
      "1f6a3-1f3fd",
      "1f6a3-1f3fe",
      "1f6a3-1f3ff"
    ]
  },
  {
    n: [
      "man-rowing-boat"
    ],
    u: "1f6a3-200d-2642-fe0f",
    v: [
      "1f6a3-1f3fb-200d-2642-fe0f",
      "1f6a3-1f3fc-200d-2642-fe0f",
      "1f6a3-1f3fd-200d-2642-fe0f",
      "1f6a3-1f3fe-200d-2642-fe0f",
      "1f6a3-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-rowing-boat"
    ],
    u: "1f6a3-200d-2640-fe0f",
    v: [
      "1f6a3-1f3fb-200d-2640-fe0f",
      "1f6a3-1f3fc-200d-2640-fe0f",
      "1f6a3-1f3fd-200d-2640-fe0f",
      "1f6a3-1f3fe-200d-2640-fe0f",
      "1f6a3-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "swimmer"
    ],
    u: "1f3ca",
    v: [
      "1f3ca-1f3fb",
      "1f3ca-1f3fc",
      "1f3ca-1f3fd",
      "1f3ca-1f3fe",
      "1f3ca-1f3ff"
    ]
  },
  {
    n: [
      "man-swimming"
    ],
    u: "1f3ca-200d-2642-fe0f",
    v: [
      "1f3ca-1f3fb-200d-2642-fe0f",
      "1f3ca-1f3fc-200d-2642-fe0f",
      "1f3ca-1f3fd-200d-2642-fe0f",
      "1f3ca-1f3fe-200d-2642-fe0f",
      "1f3ca-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-swimming"
    ],
    u: "1f3ca-200d-2640-fe0f",
    v: [
      "1f3ca-1f3fb-200d-2640-fe0f",
      "1f3ca-1f3fc-200d-2640-fe0f",
      "1f3ca-1f3fd-200d-2640-fe0f",
      "1f3ca-1f3fe-200d-2640-fe0f",
      "1f3ca-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "person_with_ball"
    ],
    u: "26f9-fe0f",
    v: [
      "26f9-1f3fb",
      "26f9-1f3fc",
      "26f9-1f3fd",
      "26f9-1f3fe",
      "26f9-1f3ff"
    ]
  },
  {
    n: [
      "man-bouncing-ball"
    ],
    u: "26f9-fe0f-200d-2642-fe0f",
    v: [
      "26f9-1f3fb-200d-2642-fe0f",
      "26f9-1f3fc-200d-2642-fe0f",
      "26f9-1f3fd-200d-2642-fe0f",
      "26f9-1f3fe-200d-2642-fe0f",
      "26f9-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-bouncing-ball"
    ],
    u: "26f9-fe0f-200d-2640-fe0f",
    v: [
      "26f9-1f3fb-200d-2640-fe0f",
      "26f9-1f3fc-200d-2640-fe0f",
      "26f9-1f3fd-200d-2640-fe0f",
      "26f9-1f3fe-200d-2640-fe0f",
      "26f9-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "weight_lifter"
    ],
    u: "1f3cb-fe0f",
    v: [
      "1f3cb-1f3fb",
      "1f3cb-1f3fc",
      "1f3cb-1f3fd",
      "1f3cb-1f3fe",
      "1f3cb-1f3ff"
    ]
  },
  {
    n: [
      "man-lifting-weights"
    ],
    u: "1f3cb-fe0f-200d-2642-fe0f",
    v: [
      "1f3cb-1f3fb-200d-2642-fe0f",
      "1f3cb-1f3fc-200d-2642-fe0f",
      "1f3cb-1f3fd-200d-2642-fe0f",
      "1f3cb-1f3fe-200d-2642-fe0f",
      "1f3cb-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-lifting-weights"
    ],
    u: "1f3cb-fe0f-200d-2640-fe0f",
    v: [
      "1f3cb-1f3fb-200d-2640-fe0f",
      "1f3cb-1f3fc-200d-2640-fe0f",
      "1f3cb-1f3fd-200d-2640-fe0f",
      "1f3cb-1f3fe-200d-2640-fe0f",
      "1f3cb-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "bicyclist"
    ],
    u: "1f6b4",
    v: [
      "1f6b4-1f3fb",
      "1f6b4-1f3fc",
      "1f6b4-1f3fd",
      "1f6b4-1f3fe",
      "1f6b4-1f3ff"
    ]
  },
  {
    n: [
      "man-biking"
    ],
    u: "1f6b4-200d-2642-fe0f",
    v: [
      "1f6b4-1f3fb-200d-2642-fe0f",
      "1f6b4-1f3fc-200d-2642-fe0f",
      "1f6b4-1f3fd-200d-2642-fe0f",
      "1f6b4-1f3fe-200d-2642-fe0f",
      "1f6b4-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-biking"
    ],
    u: "1f6b4-200d-2640-fe0f",
    v: [
      "1f6b4-1f3fb-200d-2640-fe0f",
      "1f6b4-1f3fc-200d-2640-fe0f",
      "1f6b4-1f3fd-200d-2640-fe0f",
      "1f6b4-1f3fe-200d-2640-fe0f",
      "1f6b4-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "mountain bicyclist",
      "mountain_bicyclist"
    ],
    u: "1f6b5",
    v: [
      "1f6b5-1f3fb",
      "1f6b5-1f3fc",
      "1f6b5-1f3fd",
      "1f6b5-1f3fe",
      "1f6b5-1f3ff"
    ]
  },
  {
    n: [
      "man-mountain-biking"
    ],
    u: "1f6b5-200d-2642-fe0f",
    v: [
      "1f6b5-1f3fb-200d-2642-fe0f",
      "1f6b5-1f3fc-200d-2642-fe0f",
      "1f6b5-1f3fd-200d-2642-fe0f",
      "1f6b5-1f3fe-200d-2642-fe0f",
      "1f6b5-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-mountain-biking"
    ],
    u: "1f6b5-200d-2640-fe0f",
    v: [
      "1f6b5-1f3fb-200d-2640-fe0f",
      "1f6b5-1f3fc-200d-2640-fe0f",
      "1f6b5-1f3fd-200d-2640-fe0f",
      "1f6b5-1f3fe-200d-2640-fe0f",
      "1f6b5-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "racing_car"
    ],
    u: "1f3ce-fe0f"
  },
  {
    n: [
      "racing_motorcycle"
    ],
    u: "1f3cd-fe0f"
  },
  {
    n: [
      "person doing cartwheel",
      "person_doing_cartwheel"
    ],
    u: "1f938",
    v: [
      "1f938-1f3fb",
      "1f938-1f3fc",
      "1f938-1f3fd",
      "1f938-1f3fe",
      "1f938-1f3ff"
    ]
  },
  {
    n: [
      "man-cartwheeling"
    ],
    u: "1f938-200d-2642-fe0f",
    v: [
      "1f938-1f3fb-200d-2642-fe0f",
      "1f938-1f3fc-200d-2642-fe0f",
      "1f938-1f3fd-200d-2642-fe0f",
      "1f938-1f3fe-200d-2642-fe0f",
      "1f938-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-cartwheeling"
    ],
    u: "1f938-200d-2640-fe0f",
    v: [
      "1f938-1f3fb-200d-2640-fe0f",
      "1f938-1f3fc-200d-2640-fe0f",
      "1f938-1f3fd-200d-2640-fe0f",
      "1f938-1f3fe-200d-2640-fe0f",
      "1f938-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "wrestlers"
    ],
    u: "1f93c"
  },
  {
    n: [
      "man-wrestling"
    ],
    u: "1f93c-200d-2642-fe0f"
  },
  {
    n: [
      "woman-wrestling"
    ],
    u: "1f93c-200d-2640-fe0f"
  },
  {
    n: [
      "water polo",
      "water_polo"
    ],
    u: "1f93d",
    v: [
      "1f93d-1f3fb",
      "1f93d-1f3fc",
      "1f93d-1f3fd",
      "1f93d-1f3fe",
      "1f93d-1f3ff"
    ]
  },
  {
    n: [
      "man-playing-water-polo"
    ],
    u: "1f93d-200d-2642-fe0f",
    v: [
      "1f93d-1f3fb-200d-2642-fe0f",
      "1f93d-1f3fc-200d-2642-fe0f",
      "1f93d-1f3fd-200d-2642-fe0f",
      "1f93d-1f3fe-200d-2642-fe0f",
      "1f93d-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-playing-water-polo"
    ],
    u: "1f93d-200d-2640-fe0f",
    v: [
      "1f93d-1f3fb-200d-2640-fe0f",
      "1f93d-1f3fc-200d-2640-fe0f",
      "1f93d-1f3fd-200d-2640-fe0f",
      "1f93d-1f3fe-200d-2640-fe0f",
      "1f93d-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "handball"
    ],
    u: "1f93e",
    v: [
      "1f93e-1f3fb",
      "1f93e-1f3fc",
      "1f93e-1f3fd",
      "1f93e-1f3fe",
      "1f93e-1f3ff"
    ]
  },
  {
    n: [
      "man-playing-handball"
    ],
    u: "1f93e-200d-2642-fe0f",
    v: [
      "1f93e-1f3fb-200d-2642-fe0f",
      "1f93e-1f3fc-200d-2642-fe0f",
      "1f93e-1f3fd-200d-2642-fe0f",
      "1f93e-1f3fe-200d-2642-fe0f",
      "1f93e-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-playing-handball"
    ],
    u: "1f93e-200d-2640-fe0f",
    v: [
      "1f93e-1f3fb-200d-2640-fe0f",
      "1f93e-1f3fc-200d-2640-fe0f",
      "1f93e-1f3fd-200d-2640-fe0f",
      "1f93e-1f3fe-200d-2640-fe0f",
      "1f93e-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "juggling"
    ],
    u: "1f939",
    v: [
      "1f939-1f3fb",
      "1f939-1f3fc",
      "1f939-1f3fd",
      "1f939-1f3fe",
      "1f939-1f3ff"
    ]
  },
  {
    n: [
      "man-juggling"
    ],
    u: "1f939-200d-2642-fe0f",
    v: [
      "1f939-1f3fb-200d-2642-fe0f",
      "1f939-1f3fc-200d-2642-fe0f",
      "1f939-1f3fd-200d-2642-fe0f",
      "1f939-1f3fe-200d-2642-fe0f",
      "1f939-1f3ff-200d-2642-fe0f"
    ]
  },
  {
    n: [
      "woman-juggling"
    ],
    u: "1f939-200d-2640-fe0f",
    v: [
      "1f939-1f3fb-200d-2640-fe0f",
      "1f939-1f3fc-200d-2640-fe0f",
      "1f939-1f3fd-200d-2640-fe0f",
      "1f939-1f3fe-200d-2640-fe0f",
      "1f939-1f3ff-200d-2640-fe0f"
    ]
  },
  {
    n: [
      "man and woman holding hands",
      "couple",
      "man_and_woman_holding_hands"
    ],
    u: "1f46b"
  },
  {
    n: [
      "two men holding hands",
      "two_men_holding_hands"
    ],
    u: "1f46c"
  },
  {
    n: [
      "two women holding hands",
      "two_women_holding_hands"
    ],
    u: "1f46d"
  },
  {
    n: [
      "kiss",
      "couplekiss"
    ],
    u: "1f48f"
  },
  {
    n: [
      "woman-kiss-man"
    ],
    u: "1f469-200d-2764-fe0f-200d-1f48b-200d-1f468"
  },
  {
    n: [
      "man-kiss-man"
    ],
    u: "1f468-200d-2764-fe0f-200d-1f48b-200d-1f468"
  },
  {
    n: [
      "woman-kiss-woman"
    ],
    u: "1f469-200d-2764-fe0f-200d-1f48b-200d-1f469"
  },
  {
    n: [
      "couple with heart",
      "couple_with_heart"
    ],
    u: "1f491"
  },
  {
    n: [
      "woman-heart-man"
    ],
    u: "1f469-200d-2764-fe0f-200d-1f468"
  },
  {
    n: [
      "man-heart-man"
    ],
    u: "1f468-200d-2764-fe0f-200d-1f468"
  },
  {
    n: [
      "woman-heart-woman"
    ],
    u: "1f469-200d-2764-fe0f-200d-1f469"
  },
  {
    n: [
      "family",
      "man-woman-boy"
    ],
    u: "1f46a"
  },
  {
    n: [
      "man-woman-boy",
      "family"
    ],
    u: "1f468-200d-1f469-200d-1f466"
  },
  {
    n: [
      "man-woman-girl"
    ],
    u: "1f468-200d-1f469-200d-1f467"
  },
  {
    n: [
      "man-woman-girl-boy"
    ],
    u: "1f468-200d-1f469-200d-1f467-200d-1f466"
  },
  {
    n: [
      "man-woman-boy-boy"
    ],
    u: "1f468-200d-1f469-200d-1f466-200d-1f466"
  },
  {
    n: [
      "man-woman-girl-girl"
    ],
    u: "1f468-200d-1f469-200d-1f467-200d-1f467"
  },
  {
    n: [
      "man-man-boy"
    ],
    u: "1f468-200d-1f468-200d-1f466"
  },
  {
    n: [
      "man-man-girl"
    ],
    u: "1f468-200d-1f468-200d-1f467"
  },
  {
    n: [
      "man-man-girl-boy"
    ],
    u: "1f468-200d-1f468-200d-1f467-200d-1f466"
  },
  {
    n: [
      "man-man-boy-boy"
    ],
    u: "1f468-200d-1f468-200d-1f466-200d-1f466"
  },
  {
    n: [
      "man-man-girl-girl"
    ],
    u: "1f468-200d-1f468-200d-1f467-200d-1f467"
  },
  {
    n: [
      "woman-woman-boy"
    ],
    u: "1f469-200d-1f469-200d-1f466"
  },
  {
    n: [
      "woman-woman-girl"
    ],
    u: "1f469-200d-1f469-200d-1f467"
  },
  {
    n: [
      "woman-woman-girl-boy"
    ],
    u: "1f469-200d-1f469-200d-1f467-200d-1f466"
  },
  {
    n: [
      "woman-woman-boy-boy"
    ],
    u: "1f469-200d-1f469-200d-1f466-200d-1f466"
  },
  {
    n: [
      "woman-woman-girl-girl"
    ],
    u: "1f469-200d-1f469-200d-1f467-200d-1f467"
  },
  {
    n: [
      "man-boy"
    ],
    u: "1f468-200d-1f466"
  },
  {
    n: [
      "man-boy-boy"
    ],
    u: "1f468-200d-1f466-200d-1f466"
  },
  {
    n: [
      "man-girl"
    ],
    u: "1f468-200d-1f467"
  },
  {
    n: [
      "man-girl-boy"
    ],
    u: "1f468-200d-1f467-200d-1f466"
  },
  {
    n: [
      "man-girl-girl"
    ],
    u: "1f468-200d-1f467-200d-1f467"
  },
  {
    n: [
      "woman-boy"
    ],
    u: "1f469-200d-1f466"
  },
  {
    n: [
      "woman-boy-boy"
    ],
    u: "1f469-200d-1f466-200d-1f466"
  },
  {
    n: [
      "woman-girl"
    ],
    u: "1f469-200d-1f467"
  },
  {
    n: [
      "woman-girl-boy"
    ],
    u: "1f469-200d-1f467-200d-1f466"
  },
  {
    n: [
      "woman-girl-girl"
    ],
    u: "1f469-200d-1f467-200d-1f467"
  },
  {
    n: [
      "selfie"
    ],
    u: "1f933",
    v: [
      "1f933-1f3fb",
      "1f933-1f3fc",
      "1f933-1f3fd",
      "1f933-1f3fe",
      "1f933-1f3ff"
    ]
  },
  {
    n: [
      "flexed biceps",
      "muscle"
    ],
    u: "1f4aa",
    v: [
      "1f4aa-1f3fb",
      "1f4aa-1f3fc",
      "1f4aa-1f3fd",
      "1f4aa-1f3fe",
      "1f4aa-1f3ff"
    ]
  },
  {
    n: [
      "white left pointing backhand index",
      "point_left"
    ],
    u: "1f448",
    v: [
      "1f448-1f3fb",
      "1f448-1f3fc",
      "1f448-1f3fd",
      "1f448-1f3fe",
      "1f448-1f3ff"
    ]
  },
  {
    n: [
      "white right pointing backhand index",
      "point_right"
    ],
    u: "1f449",
    v: [
      "1f449-1f3fb",
      "1f449-1f3fc",
      "1f449-1f3fd",
      "1f449-1f3fe",
      "1f449-1f3ff"
    ]
  },
  {
    n: [
      "white up pointing index",
      "point_up"
    ],
    u: "261d-fe0f",
    v: [
      "261d-1f3fb",
      "261d-1f3fc",
      "261d-1f3fd",
      "261d-1f3fe",
      "261d-1f3ff"
    ]
  },
  {
    n: [
      "white up pointing backhand index",
      "point_up_2"
    ],
    u: "1f446",
    v: [
      "1f446-1f3fb",
      "1f446-1f3fc",
      "1f446-1f3fd",
      "1f446-1f3fe",
      "1f446-1f3ff"
    ]
  },
  {
    n: [
      "reversed hand with middle finger extended",
      "middle_finger",
      "reversed_hand_with_middle_finger_extended"
    ],
    u: "1f595",
    v: [
      "1f595-1f3fb",
      "1f595-1f3fc",
      "1f595-1f3fd",
      "1f595-1f3fe",
      "1f595-1f3ff"
    ]
  },
  {
    n: [
      "white down pointing backhand index",
      "point_down"
    ],
    u: "1f447",
    v: [
      "1f447-1f3fb",
      "1f447-1f3fc",
      "1f447-1f3fd",
      "1f447-1f3fe",
      "1f447-1f3ff"
    ]
  },
  {
    n: [
      "victory hand",
      "v"
    ],
    u: "270c-fe0f",
    v: [
      "270c-1f3fb",
      "270c-1f3fc",
      "270c-1f3fd",
      "270c-1f3fe",
      "270c-1f3ff"
    ]
  },
  {
    n: [
      "hand with index and middle fingers crossed",
      "crossed_fingers",
      "hand_with_index_and_middle_fingers_crossed"
    ],
    u: "1f91e",
    v: [
      "1f91e-1f3fb",
      "1f91e-1f3fc",
      "1f91e-1f3fd",
      "1f91e-1f3fe",
      "1f91e-1f3ff"
    ]
  },
  {
    n: [
      "raised hand with part between middle and ring fingers",
      "spock-hand"
    ],
    u: "1f596",
    v: [
      "1f596-1f3fb",
      "1f596-1f3fc",
      "1f596-1f3fd",
      "1f596-1f3fe",
      "1f596-1f3ff"
    ]
  },
  {
    n: [
      "sign of the horns",
      "the_horns",
      "sign_of_the_horns"
    ],
    u: "1f918",
    v: [
      "1f918-1f3fb",
      "1f918-1f3fc",
      "1f918-1f3fd",
      "1f918-1f3fe",
      "1f918-1f3ff"
    ]
  },
  {
    n: [
      "call me hand",
      "call_me_hand"
    ],
    u: "1f919",
    v: [
      "1f919-1f3fb",
      "1f919-1f3fc",
      "1f919-1f3fd",
      "1f919-1f3fe",
      "1f919-1f3ff"
    ]
  },
  {
    n: [
      "raised_hand_with_fingers_splayed"
    ],
    u: "1f590-fe0f",
    v: [
      "1f590-1f3fb",
      "1f590-1f3fc",
      "1f590-1f3fd",
      "1f590-1f3fe",
      "1f590-1f3ff"
    ]
  },
  {
    n: [
      "raised hand",
      "hand",
      "raised_hand"
    ],
    u: "270b",
    v: [
      "270b-1f3fb",
      "270b-1f3fc",
      "270b-1f3fd",
      "270b-1f3fe",
      "270b-1f3ff"
    ]
  },
  {
    n: [
      "ok hand sign",
      "ok_hand"
    ],
    u: "1f44c",
    v: [
      "1f44c-1f3fb",
      "1f44c-1f3fc",
      "1f44c-1f3fd",
      "1f44c-1f3fe",
      "1f44c-1f3ff"
    ]
  },
  {
    n: [
      "thumbs up sign",
      "+1",
      "thumbsup"
    ],
    u: "1f44d",
    v: [
      "1f44d-1f3fb",
      "1f44d-1f3fc",
      "1f44d-1f3fd",
      "1f44d-1f3fe",
      "1f44d-1f3ff"
    ]
  },
  {
    n: [
      "thumbs down sign",
      "-1",
      "thumbsdown"
    ],
    u: "1f44e",
    v: [
      "1f44e-1f3fb",
      "1f44e-1f3fc",
      "1f44e-1f3fd",
      "1f44e-1f3fe",
      "1f44e-1f3ff"
    ]
  },
  {
    n: [
      "raised fist",
      "fist"
    ],
    u: "270a",
    v: [
      "270a-1f3fb",
      "270a-1f3fc",
      "270a-1f3fd",
      "270a-1f3fe",
      "270a-1f3ff"
    ]
  },
  {
    n: [
      "fisted hand sign",
      "facepunch",
      "punch"
    ],
    u: "1f44a",
    v: [
      "1f44a-1f3fb",
      "1f44a-1f3fc",
      "1f44a-1f3fd",
      "1f44a-1f3fe",
      "1f44a-1f3ff"
    ]
  },
  {
    n: [
      "left-facing fist",
      "left-facing_fist"
    ],
    u: "1f91b",
    v: [
      "1f91b-1f3fb",
      "1f91b-1f3fc",
      "1f91b-1f3fd",
      "1f91b-1f3fe",
      "1f91b-1f3ff"
    ]
  },
  {
    n: [
      "right-facing fist",
      "right-facing_fist"
    ],
    u: "1f91c",
    v: [
      "1f91c-1f3fb",
      "1f91c-1f3fc",
      "1f91c-1f3fd",
      "1f91c-1f3fe",
      "1f91c-1f3ff"
    ]
  },
  {
    n: [
      "raised back of hand",
      "raised_back_of_hand"
    ],
    u: "1f91a",
    v: [
      "1f91a-1f3fb",
      "1f91a-1f3fc",
      "1f91a-1f3fd",
      "1f91a-1f3fe",
      "1f91a-1f3ff"
    ]
  },
  {
    n: [
      "waving hand sign",
      "wave"
    ],
    u: "1f44b",
    v: [
      "1f44b-1f3fb",
      "1f44b-1f3fc",
      "1f44b-1f3fd",
      "1f44b-1f3fe",
      "1f44b-1f3ff"
    ]
  },
  {
    n: [
      "i love you hand sign",
      "i_love_you_hand_sign"
    ],
    u: "1f91f",
    v: [
      "1f91f-1f3fb",
      "1f91f-1f3fc",
      "1f91f-1f3fd",
      "1f91f-1f3fe",
      "1f91f-1f3ff"
    ]
  },
  {
    n: [
      "writing_hand"
    ],
    u: "270d-fe0f",
    v: [
      "270d-1f3fb",
      "270d-1f3fc",
      "270d-1f3fd",
      "270d-1f3fe",
      "270d-1f3ff"
    ]
  },
  {
    n: [
      "clapping hands sign",
      "clap"
    ],
    u: "1f44f",
    v: [
      "1f44f-1f3fb",
      "1f44f-1f3fc",
      "1f44f-1f3fd",
      "1f44f-1f3fe",
      "1f44f-1f3ff"
    ]
  },
  {
    n: [
      "open hands sign",
      "open_hands"
    ],
    u: "1f450",
    v: [
      "1f450-1f3fb",
      "1f450-1f3fc",
      "1f450-1f3fd",
      "1f450-1f3fe",
      "1f450-1f3ff"
    ]
  },
  {
    n: [
      "person raising both hands in celebration",
      "raised_hands"
    ],
    u: "1f64c",
    v: [
      "1f64c-1f3fb",
      "1f64c-1f3fc",
      "1f64c-1f3fd",
      "1f64c-1f3fe",
      "1f64c-1f3ff"
    ]
  },
  {
    n: [
      "palms up together",
      "palms_up_together"
    ],
    u: "1f932",
    v: [
      "1f932-1f3fb",
      "1f932-1f3fc",
      "1f932-1f3fd",
      "1f932-1f3fe",
      "1f932-1f3ff"
    ]
  },
  {
    n: [
      "person with folded hands",
      "pray"
    ],
    u: "1f64f",
    v: [
      "1f64f-1f3fb",
      "1f64f-1f3fc",
      "1f64f-1f3fd",
      "1f64f-1f3fe",
      "1f64f-1f3ff"
    ]
  },
  {
    n: [
      "handshake"
    ],
    u: "1f91d"
  },
  {
    n: [
      "nail polish",
      "nail_care"
    ],
    u: "1f485",
    v: [
      "1f485-1f3fb",
      "1f485-1f3fc",
      "1f485-1f3fd",
      "1f485-1f3fe",
      "1f485-1f3ff"
    ]
  },
  {
    n: [
      "ear"
    ],
    u: "1f442",
    v: [
      "1f442-1f3fb",
      "1f442-1f3fc",
      "1f442-1f3fd",
      "1f442-1f3fe",
      "1f442-1f3ff"
    ]
  },
  {
    n: [
      "nose"
    ],
    u: "1f443",
    v: [
      "1f443-1f3fb",
      "1f443-1f3fc",
      "1f443-1f3fd",
      "1f443-1f3fe",
      "1f443-1f3ff"
    ]
  },
  {
    n: [
      "footprints"
    ],
    u: "1f463"
  },
  {
    n: [
      "eyes"
    ],
    u: "1f440"
  },
  {
    n: [
      "eye"
    ],
    u: "1f441-fe0f"
  },
  {
    n: [
      "eye-in-speech-bubble"
    ],
    u: "1f441-fe0f-200d-1f5e8-fe0f"
  },
  {
    n: [
      "brain"
    ],
    u: "1f9e0"
  },
  {
    n: [
      "tongue"
    ],
    u: "1f445"
  },
  {
    n: [
      "mouth",
      "lips"
    ],
    u: "1f444"
  },
  {
    n: [
      "kiss mark",
      "kiss"
    ],
    u: "1f48b"
  },
  {
    n: [
      "heart with arrow",
      "cupid"
    ],
    u: "1f498"
  },
  {
    n: [
      "heavy black heart",
      "heart"
    ],
    u: "2764-fe0f"
  },
  {
    n: [
      "beating heart",
      "heartbeat"
    ],
    u: "1f493"
  },
  {
    n: [
      "broken heart",
      "broken_heart"
    ],
    u: "1f494"
  },
  {
    n: [
      "two hearts",
      "two_hearts"
    ],
    u: "1f495"
  },
  {
    n: [
      "sparkling heart",
      "sparkling_heart"
    ],
    u: "1f496"
  },
  {
    n: [
      "growing heart",
      "heartpulse"
    ],
    u: "1f497"
  },
  {
    n: [
      "blue heart",
      "blue_heart"
    ],
    u: "1f499"
  },
  {
    n: [
      "green heart",
      "green_heart"
    ],
    u: "1f49a"
  },
  {
    n: [
      "yellow heart",
      "yellow_heart"
    ],
    u: "1f49b"
  },
  {
    n: [
      "orange heart",
      "orange_heart"
    ],
    u: "1f9e1"
  },
  {
    n: [
      "purple heart",
      "purple_heart"
    ],
    u: "1f49c"
  },
  {
    n: [
      "black heart",
      "black_heart"
    ],
    u: "1f5a4"
  },
  {
    n: [
      "heart with ribbon",
      "gift_heart"
    ],
    u: "1f49d"
  },
  {
    n: [
      "revolving hearts",
      "revolving_hearts"
    ],
    u: "1f49e"
  },
  {
    n: [
      "heart decoration",
      "heart_decoration"
    ],
    u: "1f49f"
  },
  {
    n: [
      "heavy_heart_exclamation_mark_ornament"
    ],
    u: "2763-fe0f"
  },
  {
    n: [
      "love letter",
      "love_letter"
    ],
    u: "1f48c"
  },
  {
    n: [
      "sleeping symbol",
      "zzz"
    ],
    u: "1f4a4"
  },
  {
    n: [
      "anger symbol",
      "anger"
    ],
    u: "1f4a2"
  },
  {
    n: [
      "bomb"
    ],
    u: "1f4a3"
  },
  {
    n: [
      "collision symbol",
      "boom",
      "collision"
    ],
    u: "1f4a5"
  },
  {
    n: [
      "splashing sweat symbol",
      "sweat_drops"
    ],
    u: "1f4a6"
  },
  {
    n: [
      "dash symbol",
      "dash"
    ],
    u: "1f4a8"
  },
  {
    n: [
      "dizzy symbol",
      "dizzy"
    ],
    u: "1f4ab"
  },
  {
    n: [
      "speech balloon",
      "speech_balloon"
    ],
    u: "1f4ac"
  },
  {
    n: [
      "left_speech_bubble"
    ],
    u: "1f5e8-fe0f"
  },
  {
    n: [
      "right_anger_bubble"
    ],
    u: "1f5ef-fe0f"
  },
  {
    n: [
      "thought balloon",
      "thought_balloon"
    ],
    u: "1f4ad"
  },
  {
    n: [
      "hole"
    ],
    u: "1f573-fe0f"
  },
  {
    n: [
      "eyeglasses"
    ],
    u: "1f453"
  },
  {
    n: [
      "dark_sunglasses"
    ],
    u: "1f576-fe0f"
  },
  {
    n: [
      "necktie"
    ],
    u: "1f454"
  },
  {
    n: [
      "t-shirt",
      "shirt",
      "tshirt"
    ],
    u: "1f455"
  },
  {
    n: [
      "jeans"
    ],
    u: "1f456"
  },
  {
    n: [
      "scarf"
    ],
    u: "1f9e3"
  },
  {
    n: [
      "gloves"
    ],
    u: "1f9e4"
  },
  {
    n: [
      "coat"
    ],
    u: "1f9e5"
  },
  {
    n: [
      "socks"
    ],
    u: "1f9e6"
  },
  {
    n: [
      "dress"
    ],
    u: "1f457"
  },
  {
    n: [
      "kimono"
    ],
    u: "1f458"
  },
  {
    n: [
      "bikini"
    ],
    u: "1f459"
  },
  {
    n: [
      "womans clothes",
      "womans_clothes"
    ],
    u: "1f45a"
  },
  {
    n: [
      "purse"
    ],
    u: "1f45b"
  },
  {
    n: [
      "handbag"
    ],
    u: "1f45c"
  },
  {
    n: [
      "pouch"
    ],
    u: "1f45d"
  },
  {
    n: [
      "shopping_bags"
    ],
    u: "1f6cd-fe0f"
  },
  {
    n: [
      "school satchel",
      "school_satchel"
    ],
    u: "1f392"
  },
  {
    n: [
      "mans shoe",
      "mans_shoe",
      "shoe"
    ],
    u: "1f45e"
  },
  {
    n: [
      "athletic shoe",
      "athletic_shoe"
    ],
    u: "1f45f"
  },
  {
    n: [
      "high-heeled shoe",
      "high_heel"
    ],
    u: "1f460"
  },
  {
    n: [
      "womans sandal",
      "sandal"
    ],
    u: "1f461"
  },
  {
    n: [
      "womans boots",
      "boot"
    ],
    u: "1f462"
  },
  {
    n: [
      "crown"
    ],
    u: "1f451"
  },
  {
    n: [
      "womans hat",
      "womans_hat"
    ],
    u: "1f452"
  },
  {
    n: [
      "top hat",
      "tophat"
    ],
    u: "1f3a9"
  },
  {
    n: [
      "graduation cap",
      "mortar_board"
    ],
    u: "1f393"
  },
  {
    n: [
      "billed cap",
      "billed_cap"
    ],
    u: "1f9e2"
  },
  {
    n: [
      "helmet_with_white_cross"
    ],
    u: "26d1-fe0f"
  },
  {
    n: [
      "prayer beads",
      "prayer_beads"
    ],
    u: "1f4ff"
  },
  {
    n: [
      "lipstick"
    ],
    u: "1f484"
  },
  {
    n: [
      "ring"
    ],
    u: "1f48d"
  },
  {
    n: [
      "gem stone",
      "gem"
    ],
    u: "1f48e"
  }
];
const animals_nature$1 = [
  {
    n: [
      "monkey face",
      "monkey_face"
    ],
    u: "1f435"
  },
  {
    n: [
      "monkey"
    ],
    u: "1f412"
  },
  {
    n: [
      "gorilla"
    ],
    u: "1f98d"
  },
  {
    n: [
      "dog face",
      "dog"
    ],
    u: "1f436"
  },
  {
    n: [
      "dog",
      "dog2"
    ],
    u: "1f415"
  },
  {
    n: [
      "poodle"
    ],
    u: "1f429"
  },
  {
    n: [
      "wolf face",
      "wolf"
    ],
    u: "1f43a"
  },
  {
    n: [
      "fox face",
      "fox_face"
    ],
    u: "1f98a"
  },
  {
    n: [
      "cat face",
      "cat"
    ],
    u: "1f431"
  },
  {
    n: [
      "cat",
      "cat2"
    ],
    u: "1f408"
  },
  {
    n: [
      "lion face",
      "lion_face"
    ],
    u: "1f981"
  },
  {
    n: [
      "tiger face",
      "tiger"
    ],
    u: "1f42f"
  },
  {
    n: [
      "tiger",
      "tiger2"
    ],
    u: "1f405"
  },
  {
    n: [
      "leopard"
    ],
    u: "1f406"
  },
  {
    n: [
      "horse face",
      "horse"
    ],
    u: "1f434"
  },
  {
    n: [
      "horse",
      "racehorse"
    ],
    u: "1f40e"
  },
  {
    n: [
      "unicorn face",
      "unicorn_face"
    ],
    u: "1f984"
  },
  {
    n: [
      "zebra face",
      "zebra_face"
    ],
    u: "1f993"
  },
  {
    n: [
      "deer"
    ],
    u: "1f98c"
  },
  {
    n: [
      "cow face",
      "cow"
    ],
    u: "1f42e"
  },
  {
    n: [
      "ox"
    ],
    u: "1f402"
  },
  {
    n: [
      "water buffalo",
      "water_buffalo"
    ],
    u: "1f403"
  },
  {
    n: [
      "cow",
      "cow2"
    ],
    u: "1f404"
  },
  {
    n: [
      "pig face",
      "pig"
    ],
    u: "1f437"
  },
  {
    n: [
      "pig",
      "pig2"
    ],
    u: "1f416"
  },
  {
    n: [
      "boar"
    ],
    u: "1f417"
  },
  {
    n: [
      "pig nose",
      "pig_nose"
    ],
    u: "1f43d"
  },
  {
    n: [
      "ram"
    ],
    u: "1f40f"
  },
  {
    n: [
      "sheep"
    ],
    u: "1f411"
  },
  {
    n: [
      "goat"
    ],
    u: "1f410"
  },
  {
    n: [
      "dromedary camel",
      "dromedary_camel"
    ],
    u: "1f42a"
  },
  {
    n: [
      "bactrian camel",
      "camel"
    ],
    u: "1f42b"
  },
  {
    n: [
      "giraffe face",
      "giraffe_face"
    ],
    u: "1f992"
  },
  {
    n: [
      "elephant"
    ],
    u: "1f418"
  },
  {
    n: [
      "rhinoceros"
    ],
    u: "1f98f"
  },
  {
    n: [
      "mouse face",
      "mouse"
    ],
    u: "1f42d"
  },
  {
    n: [
      "mouse",
      "mouse2"
    ],
    u: "1f401"
  },
  {
    n: [
      "rat"
    ],
    u: "1f400"
  },
  {
    n: [
      "hamster face",
      "hamster"
    ],
    u: "1f439"
  },
  {
    n: [
      "rabbit face",
      "rabbit"
    ],
    u: "1f430"
  },
  {
    n: [
      "rabbit",
      "rabbit2"
    ],
    u: "1f407"
  },
  {
    n: [
      "chipmunk"
    ],
    u: "1f43f-fe0f"
  },
  {
    n: [
      "hedgehog"
    ],
    u: "1f994"
  },
  {
    n: [
      "bat"
    ],
    u: "1f987"
  },
  {
    n: [
      "bear face",
      "bear"
    ],
    u: "1f43b"
  },
  {
    n: [
      "koala"
    ],
    u: "1f428"
  },
  {
    n: [
      "panda face",
      "panda_face"
    ],
    u: "1f43c"
  },
  {
    n: [
      "paw prints",
      "feet",
      "paw_prints"
    ],
    u: "1f43e"
  },
  {
    n: [
      "turkey"
    ],
    u: "1f983"
  },
  {
    n: [
      "chicken"
    ],
    u: "1f414"
  },
  {
    n: [
      "rooster"
    ],
    u: "1f413"
  },
  {
    n: [
      "hatching chick",
      "hatching_chick"
    ],
    u: "1f423"
  },
  {
    n: [
      "baby chick",
      "baby_chick"
    ],
    u: "1f424"
  },
  {
    n: [
      "front-facing baby chick",
      "hatched_chick"
    ],
    u: "1f425"
  },
  {
    n: [
      "bird"
    ],
    u: "1f426"
  },
  {
    n: [
      "penguin"
    ],
    u: "1f427"
  },
  {
    n: [
      "dove_of_peace"
    ],
    u: "1f54a-fe0f"
  },
  {
    n: [
      "eagle"
    ],
    u: "1f985"
  },
  {
    n: [
      "duck"
    ],
    u: "1f986"
  },
  {
    n: [
      "owl"
    ],
    u: "1f989"
  },
  {
    n: [
      "frog face",
      "frog"
    ],
    u: "1f438"
  },
  {
    n: [
      "crocodile"
    ],
    u: "1f40a"
  },
  {
    n: [
      "turtle"
    ],
    u: "1f422"
  },
  {
    n: [
      "lizard"
    ],
    u: "1f98e"
  },
  {
    n: [
      "snake"
    ],
    u: "1f40d"
  },
  {
    n: [
      "dragon face",
      "dragon_face"
    ],
    u: "1f432"
  },
  {
    n: [
      "dragon"
    ],
    u: "1f409"
  },
  {
    n: [
      "sauropod"
    ],
    u: "1f995"
  },
  {
    n: [
      "t-rex"
    ],
    u: "1f996"
  },
  {
    n: [
      "spouting whale",
      "whale"
    ],
    u: "1f433"
  },
  {
    n: [
      "whale",
      "whale2"
    ],
    u: "1f40b"
  },
  {
    n: [
      "dolphin",
      "flipper"
    ],
    u: "1f42c"
  },
  {
    n: [
      "fish"
    ],
    u: "1f41f"
  },
  {
    n: [
      "tropical fish",
      "tropical_fish"
    ],
    u: "1f420"
  },
  {
    n: [
      "blowfish"
    ],
    u: "1f421"
  },
  {
    n: [
      "shark"
    ],
    u: "1f988"
  },
  {
    n: [
      "octopus"
    ],
    u: "1f419"
  },
  {
    n: [
      "spiral shell",
      "shell"
    ],
    u: "1f41a"
  },
  {
    n: [
      "crab"
    ],
    u: "1f980"
  },
  {
    n: [
      "shrimp"
    ],
    u: "1f990"
  },
  {
    n: [
      "squid"
    ],
    u: "1f991"
  },
  {
    n: [
      "snail"
    ],
    u: "1f40c"
  },
  {
    n: [
      "butterfly"
    ],
    u: "1f98b"
  },
  {
    n: [
      "bug"
    ],
    u: "1f41b"
  },
  {
    n: [
      "ant"
    ],
    u: "1f41c"
  },
  {
    n: [
      "honeybee",
      "bee"
    ],
    u: "1f41d"
  },
  {
    n: [
      "lady beetle",
      "beetle"
    ],
    u: "1f41e"
  },
  {
    n: [
      "cricket"
    ],
    u: "1f997"
  },
  {
    n: [
      "spider"
    ],
    u: "1f577-fe0f"
  },
  {
    n: [
      "spider_web"
    ],
    u: "1f578-fe0f"
  },
  {
    n: [
      "scorpion"
    ],
    u: "1f982"
  },
  {
    n: [
      "bouquet"
    ],
    u: "1f490"
  },
  {
    n: [
      "cherry blossom",
      "cherry_blossom"
    ],
    u: "1f338"
  },
  {
    n: [
      "white flower",
      "white_flower"
    ],
    u: "1f4ae"
  },
  {
    n: [
      "rosette"
    ],
    u: "1f3f5-fe0f"
  },
  {
    n: [
      "rose"
    ],
    u: "1f339"
  },
  {
    n: [
      "wilted flower",
      "wilted_flower"
    ],
    u: "1f940"
  },
  {
    n: [
      "hibiscus"
    ],
    u: "1f33a"
  },
  {
    n: [
      "sunflower"
    ],
    u: "1f33b"
  },
  {
    n: [
      "blossom"
    ],
    u: "1f33c"
  },
  {
    n: [
      "tulip"
    ],
    u: "1f337"
  },
  {
    n: [
      "seedling"
    ],
    u: "1f331"
  },
  {
    n: [
      "evergreen tree",
      "evergreen_tree"
    ],
    u: "1f332"
  },
  {
    n: [
      "deciduous tree",
      "deciduous_tree"
    ],
    u: "1f333"
  },
  {
    n: [
      "palm tree",
      "palm_tree"
    ],
    u: "1f334"
  },
  {
    n: [
      "cactus"
    ],
    u: "1f335"
  },
  {
    n: [
      "ear of rice",
      "ear_of_rice"
    ],
    u: "1f33e"
  },
  {
    n: [
      "herb"
    ],
    u: "1f33f"
  },
  {
    n: [
      "shamrock"
    ],
    u: "2618-fe0f"
  },
  {
    n: [
      "four leaf clover",
      "four_leaf_clover"
    ],
    u: "1f340"
  },
  {
    n: [
      "maple leaf",
      "maple_leaf"
    ],
    u: "1f341"
  },
  {
    n: [
      "fallen leaf",
      "fallen_leaf"
    ],
    u: "1f342"
  },
  {
    n: [
      "leaf fluttering in wind",
      "leaves"
    ],
    u: "1f343"
  }
];
const food_drink$1 = [
  {
    n: [
      "grapes"
    ],
    u: "1f347"
  },
  {
    n: [
      "melon"
    ],
    u: "1f348"
  },
  {
    n: [
      "watermelon"
    ],
    u: "1f349"
  },
  {
    n: [
      "tangerine"
    ],
    u: "1f34a"
  },
  {
    n: [
      "lemon"
    ],
    u: "1f34b"
  },
  {
    n: [
      "banana"
    ],
    u: "1f34c"
  },
  {
    n: [
      "pineapple"
    ],
    u: "1f34d"
  },
  {
    n: [
      "red apple",
      "apple"
    ],
    u: "1f34e"
  },
  {
    n: [
      "green apple",
      "green_apple"
    ],
    u: "1f34f"
  },
  {
    n: [
      "pear"
    ],
    u: "1f350"
  },
  {
    n: [
      "peach"
    ],
    u: "1f351"
  },
  {
    n: [
      "cherries"
    ],
    u: "1f352"
  },
  {
    n: [
      "strawberry"
    ],
    u: "1f353"
  },
  {
    n: [
      "kiwifruit"
    ],
    u: "1f95d"
  },
  {
    n: [
      "tomato"
    ],
    u: "1f345"
  },
  {
    n: [
      "coconut"
    ],
    u: "1f965"
  },
  {
    n: [
      "avocado"
    ],
    u: "1f951"
  },
  {
    n: [
      "aubergine",
      "eggplant"
    ],
    u: "1f346"
  },
  {
    n: [
      "potato"
    ],
    u: "1f954"
  },
  {
    n: [
      "carrot"
    ],
    u: "1f955"
  },
  {
    n: [
      "ear of maize",
      "corn"
    ],
    u: "1f33d"
  },
  {
    n: [
      "hot_pepper"
    ],
    u: "1f336-fe0f"
  },
  {
    n: [
      "cucumber"
    ],
    u: "1f952"
  },
  {
    n: [
      "broccoli"
    ],
    u: "1f966"
  },
  {
    n: [
      "mushroom"
    ],
    u: "1f344"
  },
  {
    n: [
      "peanuts"
    ],
    u: "1f95c"
  },
  {
    n: [
      "chestnut"
    ],
    u: "1f330"
  },
  {
    n: [
      "bread"
    ],
    u: "1f35e"
  },
  {
    n: [
      "croissant"
    ],
    u: "1f950"
  },
  {
    n: [
      "baguette bread",
      "baguette_bread"
    ],
    u: "1f956"
  },
  {
    n: [
      "pretzel"
    ],
    u: "1f968"
  },
  {
    n: [
      "pancakes"
    ],
    u: "1f95e"
  },
  {
    n: [
      "cheese wedge",
      "cheese_wedge"
    ],
    u: "1f9c0"
  },
  {
    n: [
      "meat on bone",
      "meat_on_bone"
    ],
    u: "1f356"
  },
  {
    n: [
      "poultry leg",
      "poultry_leg"
    ],
    u: "1f357"
  },
  {
    n: [
      "cut of meat",
      "cut_of_meat"
    ],
    u: "1f969"
  },
  {
    n: [
      "bacon"
    ],
    u: "1f953"
  },
  {
    n: [
      "hamburger"
    ],
    u: "1f354"
  },
  {
    n: [
      "french fries",
      "fries"
    ],
    u: "1f35f"
  },
  {
    n: [
      "slice of pizza",
      "pizza"
    ],
    u: "1f355"
  },
  {
    n: [
      "hot dog",
      "hotdog"
    ],
    u: "1f32d"
  },
  {
    n: [
      "sandwich"
    ],
    u: "1f96a"
  },
  {
    n: [
      "taco"
    ],
    u: "1f32e"
  },
  {
    n: [
      "burrito"
    ],
    u: "1f32f"
  },
  {
    n: [
      "stuffed flatbread",
      "stuffed_flatbread"
    ],
    u: "1f959"
  },
  {
    n: [
      "egg"
    ],
    u: "1f95a"
  },
  {
    n: [
      "cooking",
      "fried_egg"
    ],
    u: "1f373"
  },
  {
    n: [
      "shallow pan of food",
      "shallow_pan_of_food"
    ],
    u: "1f958"
  },
  {
    n: [
      "pot of food",
      "stew"
    ],
    u: "1f372"
  },
  {
    n: [
      "bowl with spoon",
      "bowl_with_spoon"
    ],
    u: "1f963"
  },
  {
    n: [
      "green salad",
      "green_salad"
    ],
    u: "1f957"
  },
  {
    n: [
      "popcorn"
    ],
    u: "1f37f"
  },
  {
    n: [
      "canned food",
      "canned_food"
    ],
    u: "1f96b"
  },
  {
    n: [
      "bento box",
      "bento"
    ],
    u: "1f371"
  },
  {
    n: [
      "rice cracker",
      "rice_cracker"
    ],
    u: "1f358"
  },
  {
    n: [
      "rice ball",
      "rice_ball"
    ],
    u: "1f359"
  },
  {
    n: [
      "cooked rice",
      "rice"
    ],
    u: "1f35a"
  },
  {
    n: [
      "curry and rice",
      "curry"
    ],
    u: "1f35b"
  },
  {
    n: [
      "steaming bowl",
      "ramen"
    ],
    u: "1f35c"
  },
  {
    n: [
      "spaghetti"
    ],
    u: "1f35d"
  },
  {
    n: [
      "roasted sweet potato",
      "sweet_potato"
    ],
    u: "1f360"
  },
  {
    n: [
      "oden"
    ],
    u: "1f362"
  },
  {
    n: [
      "sushi"
    ],
    u: "1f363"
  },
  {
    n: [
      "fried shrimp",
      "fried_shrimp"
    ],
    u: "1f364"
  },
  {
    n: [
      "fish cake with swirl design",
      "fish_cake"
    ],
    u: "1f365"
  },
  {
    n: [
      "dango"
    ],
    u: "1f361"
  },
  {
    n: [
      "dumpling"
    ],
    u: "1f95f"
  },
  {
    n: [
      "fortune cookie",
      "fortune_cookie"
    ],
    u: "1f960"
  },
  {
    n: [
      "takeout box",
      "takeout_box"
    ],
    u: "1f961"
  },
  {
    n: [
      "soft ice cream",
      "icecream"
    ],
    u: "1f366"
  },
  {
    n: [
      "shaved ice",
      "shaved_ice"
    ],
    u: "1f367"
  },
  {
    n: [
      "ice cream",
      "ice_cream"
    ],
    u: "1f368"
  },
  {
    n: [
      "doughnut"
    ],
    u: "1f369"
  },
  {
    n: [
      "cookie"
    ],
    u: "1f36a"
  },
  {
    n: [
      "birthday cake",
      "birthday"
    ],
    u: "1f382"
  },
  {
    n: [
      "shortcake",
      "cake"
    ],
    u: "1f370"
  },
  {
    n: [
      "pie"
    ],
    u: "1f967"
  },
  {
    n: [
      "chocolate bar",
      "chocolate_bar"
    ],
    u: "1f36b"
  },
  {
    n: [
      "candy"
    ],
    u: "1f36c"
  },
  {
    n: [
      "lollipop"
    ],
    u: "1f36d"
  },
  {
    n: [
      "custard"
    ],
    u: "1f36e"
  },
  {
    n: [
      "honey pot",
      "honey_pot"
    ],
    u: "1f36f"
  },
  {
    n: [
      "baby bottle",
      "baby_bottle"
    ],
    u: "1f37c"
  },
  {
    n: [
      "glass of milk",
      "glass_of_milk"
    ],
    u: "1f95b"
  },
  {
    n: [
      "hot beverage",
      "coffee"
    ],
    u: "2615"
  },
  {
    n: [
      "teacup without handle",
      "tea"
    ],
    u: "1f375"
  },
  {
    n: [
      "sake bottle and cup",
      "sake"
    ],
    u: "1f376"
  },
  {
    n: [
      "bottle with popping cork",
      "champagne"
    ],
    u: "1f37e"
  },
  {
    n: [
      "wine glass",
      "wine_glass"
    ],
    u: "1f377"
  },
  {
    n: [
      "cocktail glass",
      "cocktail"
    ],
    u: "1f378"
  },
  {
    n: [
      "tropical drink",
      "tropical_drink"
    ],
    u: "1f379"
  },
  {
    n: [
      "beer mug",
      "beer"
    ],
    u: "1f37a"
  },
  {
    n: [
      "clinking beer mugs",
      "beers"
    ],
    u: "1f37b"
  },
  {
    n: [
      "clinking glasses",
      "clinking_glasses"
    ],
    u: "1f942"
  },
  {
    n: [
      "tumbler glass",
      "tumbler_glass"
    ],
    u: "1f943"
  },
  {
    n: [
      "cup with straw",
      "cup_with_straw"
    ],
    u: "1f964"
  },
  {
    n: [
      "chopsticks"
    ],
    u: "1f962"
  },
  {
    n: [
      "knife_fork_plate"
    ],
    u: "1f37d-fe0f"
  },
  {
    n: [
      "fork and knife",
      "fork_and_knife"
    ],
    u: "1f374"
  },
  {
    n: [
      "spoon"
    ],
    u: "1f944"
  },
  {
    n: [
      "hocho",
      "knife"
    ],
    u: "1f52a"
  },
  {
    n: [
      "amphora"
    ],
    u: "1f3fa"
  }
];
const activities$1 = [
  {
    n: [
      "jack-o-lantern",
      "jack_o_lantern"
    ],
    u: "1f383"
  },
  {
    n: [
      "christmas tree",
      "christmas_tree"
    ],
    u: "1f384"
  },
  {
    n: [
      "fireworks"
    ],
    u: "1f386"
  },
  {
    n: [
      "firework sparkler",
      "sparkler"
    ],
    u: "1f387"
  },
  {
    n: [
      "sparkles"
    ],
    u: "2728"
  },
  {
    n: [
      "balloon"
    ],
    u: "1f388"
  },
  {
    n: [
      "party popper",
      "tada"
    ],
    u: "1f389"
  },
  {
    n: [
      "confetti ball",
      "confetti_ball"
    ],
    u: "1f38a"
  },
  {
    n: [
      "tanabata tree",
      "tanabata_tree"
    ],
    u: "1f38b"
  },
  {
    n: [
      "pine decoration",
      "bamboo"
    ],
    u: "1f38d"
  },
  {
    n: [
      "japanese dolls",
      "dolls"
    ],
    u: "1f38e"
  },
  {
    n: [
      "carp streamer",
      "flags"
    ],
    u: "1f38f"
  },
  {
    n: [
      "wind chime",
      "wind_chime"
    ],
    u: "1f390"
  },
  {
    n: [
      "moon viewing ceremony",
      "rice_scene"
    ],
    u: "1f391"
  },
  {
    n: [
      "ribbon"
    ],
    u: "1f380"
  },
  {
    n: [
      "wrapped present",
      "gift"
    ],
    u: "1f381"
  },
  {
    n: [
      "reminder_ribbon"
    ],
    u: "1f397-fe0f"
  },
  {
    n: [
      "admission_tickets"
    ],
    u: "1f39f-fe0f"
  },
  {
    n: [
      "ticket"
    ],
    u: "1f3ab"
  },
  {
    n: [
      "medal"
    ],
    u: "1f396-fe0f"
  },
  {
    n: [
      "trophy"
    ],
    u: "1f3c6"
  },
  {
    n: [
      "sports medal",
      "sports_medal"
    ],
    u: "1f3c5"
  },
  {
    n: [
      "first place medal",
      "first_place_medal"
    ],
    u: "1f947"
  },
  {
    n: [
      "second place medal",
      "second_place_medal"
    ],
    u: "1f948"
  },
  {
    n: [
      "third place medal",
      "third_place_medal"
    ],
    u: "1f949"
  },
  {
    n: [
      "soccer ball",
      "soccer"
    ],
    u: "26bd"
  },
  {
    n: [
      "baseball"
    ],
    u: "26be"
  },
  {
    n: [
      "basketball and hoop",
      "basketball"
    ],
    u: "1f3c0"
  },
  {
    n: [
      "volleyball"
    ],
    u: "1f3d0"
  },
  {
    n: [
      "american football",
      "football"
    ],
    u: "1f3c8"
  },
  {
    n: [
      "rugby football",
      "rugby_football"
    ],
    u: "1f3c9"
  },
  {
    n: [
      "tennis racquet and ball",
      "tennis"
    ],
    u: "1f3be"
  },
  {
    n: [
      "billiards",
      "8ball"
    ],
    u: "1f3b1"
  },
  {
    n: [
      "bowling"
    ],
    u: "1f3b3"
  },
  {
    n: [
      "cricket bat and ball",
      "cricket_bat_and_ball"
    ],
    u: "1f3cf"
  },
  {
    n: [
      "field hockey stick and ball",
      "field_hockey_stick_and_ball"
    ],
    u: "1f3d1"
  },
  {
    n: [
      "ice hockey stick and puck",
      "ice_hockey_stick_and_puck"
    ],
    u: "1f3d2"
  },
  {
    n: [
      "table tennis paddle and ball",
      "table_tennis_paddle_and_ball"
    ],
    u: "1f3d3"
  },
  {
    n: [
      "badminton racquet and shuttlecock",
      "badminton_racquet_and_shuttlecock"
    ],
    u: "1f3f8"
  },
  {
    n: [
      "boxing glove",
      "boxing_glove"
    ],
    u: "1f94a"
  },
  {
    n: [
      "martial arts uniform",
      "martial_arts_uniform"
    ],
    u: "1f94b"
  },
  {
    n: [
      "goal net",
      "goal_net"
    ],
    u: "1f945"
  },
  {
    n: [
      "direct hit",
      "dart"
    ],
    u: "1f3af"
  },
  {
    n: [
      "flag in hole",
      "golf"
    ],
    u: "26f3"
  },
  {
    n: [
      "ice_skate"
    ],
    u: "26f8-fe0f"
  },
  {
    n: [
      "fishing pole and fish",
      "fishing_pole_and_fish"
    ],
    u: "1f3a3"
  },
  {
    n: [
      "running shirt with sash",
      "running_shirt_with_sash"
    ],
    u: "1f3bd"
  },
  {
    n: [
      "ski and ski boot",
      "ski"
    ],
    u: "1f3bf"
  },
  {
    n: [
      "sled"
    ],
    u: "1f6f7"
  },
  {
    n: [
      "curling stone",
      "curling_stone"
    ],
    u: "1f94c"
  },
  {
    n: [
      "video game",
      "video_game"
    ],
    u: "1f3ae"
  },
  {
    n: [
      "joystick"
    ],
    u: "1f579-fe0f"
  },
  {
    n: [
      "game die",
      "game_die"
    ],
    u: "1f3b2"
  },
  {
    n: [
      "black spade suit",
      "spades"
    ],
    u: "2660-fe0f"
  },
  {
    n: [
      "black heart suit",
      "hearts"
    ],
    u: "2665-fe0f"
  },
  {
    n: [
      "black diamond suit",
      "diamonds"
    ],
    u: "2666-fe0f"
  },
  {
    n: [
      "black club suit",
      "clubs"
    ],
    u: "2663-fe0f"
  },
  {
    n: [
      "playing card black joker",
      "black_joker"
    ],
    u: "1f0cf"
  },
  {
    n: [
      "mahjong tile red dragon",
      "mahjong"
    ],
    u: "1f004"
  },
  {
    n: [
      "flower playing cards",
      "flower_playing_cards"
    ],
    u: "1f3b4"
  }
];
const travel_places$1 = [
  {
    n: [
      "earth globe europe-africa",
      "earth_africa"
    ],
    u: "1f30d"
  },
  {
    n: [
      "earth globe americas",
      "earth_americas"
    ],
    u: "1f30e"
  },
  {
    n: [
      "earth globe asia-australia",
      "earth_asia"
    ],
    u: "1f30f"
  },
  {
    n: [
      "globe with meridians",
      "globe_with_meridians"
    ],
    u: "1f310"
  },
  {
    n: [
      "world_map"
    ],
    u: "1f5fa-fe0f"
  },
  {
    n: [
      "silhouette of japan",
      "japan"
    ],
    u: "1f5fe"
  },
  {
    n: [
      "snow_capped_mountain"
    ],
    u: "1f3d4-fe0f"
  },
  {
    n: [
      "mountain"
    ],
    u: "26f0-fe0f"
  },
  {
    n: [
      "volcano"
    ],
    u: "1f30b"
  },
  {
    n: [
      "mount fuji",
      "mount_fuji"
    ],
    u: "1f5fb"
  },
  {
    n: [
      "camping"
    ],
    u: "1f3d5-fe0f"
  },
  {
    n: [
      "beach_with_umbrella"
    ],
    u: "1f3d6-fe0f"
  },
  {
    n: [
      "desert"
    ],
    u: "1f3dc-fe0f"
  },
  {
    n: [
      "desert_island"
    ],
    u: "1f3dd-fe0f"
  },
  {
    n: [
      "national_park"
    ],
    u: "1f3de-fe0f"
  },
  {
    n: [
      "stadium"
    ],
    u: "1f3df-fe0f"
  },
  {
    n: [
      "classical_building"
    ],
    u: "1f3db-fe0f"
  },
  {
    n: [
      "building_construction"
    ],
    u: "1f3d7-fe0f"
  },
  {
    n: [
      "house_buildings"
    ],
    u: "1f3d8-fe0f"
  },
  {
    n: [
      "cityscape"
    ],
    u: "1f3d9-fe0f"
  },
  {
    n: [
      "derelict_house_building"
    ],
    u: "1f3da-fe0f"
  },
  {
    n: [
      "house building",
      "house"
    ],
    u: "1f3e0"
  },
  {
    n: [
      "house with garden",
      "house_with_garden"
    ],
    u: "1f3e1"
  },
  {
    n: [
      "office building",
      "office"
    ],
    u: "1f3e2"
  },
  {
    n: [
      "japanese post office",
      "post_office"
    ],
    u: "1f3e3"
  },
  {
    n: [
      "european post office",
      "european_post_office"
    ],
    u: "1f3e4"
  },
  {
    n: [
      "hospital"
    ],
    u: "1f3e5"
  },
  {
    n: [
      "bank"
    ],
    u: "1f3e6"
  },
  {
    n: [
      "hotel"
    ],
    u: "1f3e8"
  },
  {
    n: [
      "love hotel",
      "love_hotel"
    ],
    u: "1f3e9"
  },
  {
    n: [
      "convenience store",
      "convenience_store"
    ],
    u: "1f3ea"
  },
  {
    n: [
      "school"
    ],
    u: "1f3eb"
  },
  {
    n: [
      "department store",
      "department_store"
    ],
    u: "1f3ec"
  },
  {
    n: [
      "factory"
    ],
    u: "1f3ed"
  },
  {
    n: [
      "japanese castle",
      "japanese_castle"
    ],
    u: "1f3ef"
  },
  {
    n: [
      "european castle",
      "european_castle"
    ],
    u: "1f3f0"
  },
  {
    n: [
      "wedding"
    ],
    u: "1f492"
  },
  {
    n: [
      "tokyo tower",
      "tokyo_tower"
    ],
    u: "1f5fc"
  },
  {
    n: [
      "statue of liberty",
      "statue_of_liberty"
    ],
    u: "1f5fd"
  },
  {
    n: [
      "church"
    ],
    u: "26ea"
  },
  {
    n: [
      "mosque"
    ],
    u: "1f54c"
  },
  {
    n: [
      "synagogue"
    ],
    u: "1f54d"
  },
  {
    n: [
      "shinto_shrine"
    ],
    u: "26e9-fe0f"
  },
  {
    n: [
      "kaaba"
    ],
    u: "1f54b"
  },
  {
    n: [
      "fountain"
    ],
    u: "26f2"
  },
  {
    n: [
      "tent"
    ],
    u: "26fa"
  },
  {
    n: [
      "foggy"
    ],
    u: "1f301"
  },
  {
    n: [
      "night with stars",
      "night_with_stars"
    ],
    u: "1f303"
  },
  {
    n: [
      "sunrise over mountains",
      "sunrise_over_mountains"
    ],
    u: "1f304"
  },
  {
    n: [
      "sunrise"
    ],
    u: "1f305"
  },
  {
    n: [
      "cityscape at dusk",
      "city_sunset"
    ],
    u: "1f306"
  },
  {
    n: [
      "sunset over buildings",
      "city_sunrise"
    ],
    u: "1f307"
  },
  {
    n: [
      "bridge at night",
      "bridge_at_night"
    ],
    u: "1f309"
  },
  {
    n: [
      "hot springs",
      "hotsprings"
    ],
    u: "2668-fe0f"
  },
  {
    n: [
      "milky way",
      "milky_way"
    ],
    u: "1f30c"
  },
  {
    n: [
      "carousel horse",
      "carousel_horse"
    ],
    u: "1f3a0"
  },
  {
    n: [
      "ferris wheel",
      "ferris_wheel"
    ],
    u: "1f3a1"
  },
  {
    n: [
      "roller coaster",
      "roller_coaster"
    ],
    u: "1f3a2"
  },
  {
    n: [
      "barber pole",
      "barber"
    ],
    u: "1f488"
  },
  {
    n: [
      "circus tent",
      "circus_tent"
    ],
    u: "1f3aa"
  },
  {
    n: [
      "performing arts",
      "performing_arts"
    ],
    u: "1f3ad"
  },
  {
    n: [
      "frame_with_picture"
    ],
    u: "1f5bc-fe0f"
  },
  {
    n: [
      "artist palette",
      "art"
    ],
    u: "1f3a8"
  },
  {
    n: [
      "slot machine",
      "slot_machine"
    ],
    u: "1f3b0"
  },
  {
    n: [
      "steam locomotive",
      "steam_locomotive"
    ],
    u: "1f682"
  },
  {
    n: [
      "railway car",
      "railway_car"
    ],
    u: "1f683"
  },
  {
    n: [
      "high-speed train",
      "bullettrain_side"
    ],
    u: "1f684"
  },
  {
    n: [
      "high-speed train with bullet nose",
      "bullettrain_front"
    ],
    u: "1f685"
  },
  {
    n: [
      "train",
      "train2"
    ],
    u: "1f686"
  },
  {
    n: [
      "metro"
    ],
    u: "1f687"
  },
  {
    n: [
      "light rail",
      "light_rail"
    ],
    u: "1f688"
  },
  {
    n: [
      "station"
    ],
    u: "1f689"
  },
  {
    n: [
      "tram"
    ],
    u: "1f68a"
  },
  {
    n: [
      "monorail"
    ],
    u: "1f69d"
  },
  {
    n: [
      "mountain railway",
      "mountain_railway"
    ],
    u: "1f69e"
  },
  {
    n: [
      "tram car",
      "train"
    ],
    u: "1f68b"
  },
  {
    n: [
      "bus"
    ],
    u: "1f68c"
  },
  {
    n: [
      "oncoming bus",
      "oncoming_bus"
    ],
    u: "1f68d"
  },
  {
    n: [
      "trolleybus"
    ],
    u: "1f68e"
  },
  {
    n: [
      "minibus"
    ],
    u: "1f690"
  },
  {
    n: [
      "ambulance"
    ],
    u: "1f691"
  },
  {
    n: [
      "fire engine",
      "fire_engine"
    ],
    u: "1f692"
  },
  {
    n: [
      "police car",
      "police_car"
    ],
    u: "1f693"
  },
  {
    n: [
      "oncoming police car",
      "oncoming_police_car"
    ],
    u: "1f694"
  },
  {
    n: [
      "taxi"
    ],
    u: "1f695"
  },
  {
    n: [
      "oncoming taxi",
      "oncoming_taxi"
    ],
    u: "1f696"
  },
  {
    n: [
      "automobile",
      "car",
      "red_car"
    ],
    u: "1f697"
  },
  {
    n: [
      "oncoming automobile",
      "oncoming_automobile"
    ],
    u: "1f698"
  },
  {
    n: [
      "recreational vehicle",
      "blue_car"
    ],
    u: "1f699"
  },
  {
    n: [
      "delivery truck",
      "truck"
    ],
    u: "1f69a"
  },
  {
    n: [
      "articulated lorry",
      "articulated_lorry"
    ],
    u: "1f69b"
  },
  {
    n: [
      "tractor"
    ],
    u: "1f69c"
  },
  {
    n: [
      "bicycle",
      "bike"
    ],
    u: "1f6b2"
  },
  {
    n: [
      "scooter"
    ],
    u: "1f6f4"
  },
  {
    n: [
      "motor scooter",
      "motor_scooter"
    ],
    u: "1f6f5"
  },
  {
    n: [
      "bus stop",
      "busstop"
    ],
    u: "1f68f"
  },
  {
    n: [
      "motorway"
    ],
    u: "1f6e3-fe0f"
  },
  {
    n: [
      "railway_track"
    ],
    u: "1f6e4-fe0f"
  },
  {
    n: [
      "fuel pump",
      "fuelpump"
    ],
    u: "26fd"
  },
  {
    n: [
      "police cars revolving light",
      "rotating_light"
    ],
    u: "1f6a8"
  },
  {
    n: [
      "horizontal traffic light",
      "traffic_light"
    ],
    u: "1f6a5"
  },
  {
    n: [
      "vertical traffic light",
      "vertical_traffic_light"
    ],
    u: "1f6a6"
  },
  {
    n: [
      "construction sign",
      "construction"
    ],
    u: "1f6a7"
  },
  {
    n: [
      "octagonal sign",
      "octagonal_sign"
    ],
    u: "1f6d1"
  },
  {
    n: [
      "anchor"
    ],
    u: "2693"
  },
  {
    n: [
      "sailboat",
      "boat"
    ],
    u: "26f5"
  },
  {
    n: [
      "canoe"
    ],
    u: "1f6f6"
  },
  {
    n: [
      "speedboat"
    ],
    u: "1f6a4"
  },
  {
    n: [
      "passenger_ship"
    ],
    u: "1f6f3-fe0f"
  },
  {
    n: [
      "ferry"
    ],
    u: "26f4-fe0f"
  },
  {
    n: [
      "motor_boat"
    ],
    u: "1f6e5-fe0f"
  },
  {
    n: [
      "ship"
    ],
    u: "1f6a2"
  },
  {
    n: [
      "airplane"
    ],
    u: "2708-fe0f"
  },
  {
    n: [
      "small_airplane"
    ],
    u: "1f6e9-fe0f"
  },
  {
    n: [
      "airplane departure",
      "airplane_departure"
    ],
    u: "1f6eb"
  },
  {
    n: [
      "airplane arriving",
      "airplane_arriving"
    ],
    u: "1f6ec"
  },
  {
    n: [
      "seat"
    ],
    u: "1f4ba"
  },
  {
    n: [
      "helicopter"
    ],
    u: "1f681"
  },
  {
    n: [
      "suspension railway",
      "suspension_railway"
    ],
    u: "1f69f"
  },
  {
    n: [
      "mountain cableway",
      "mountain_cableway"
    ],
    u: "1f6a0"
  },
  {
    n: [
      "aerial tramway",
      "aerial_tramway"
    ],
    u: "1f6a1"
  },
  {
    n: [
      "satellite"
    ],
    u: "1f6f0-fe0f"
  },
  {
    n: [
      "rocket"
    ],
    u: "1f680"
  },
  {
    n: [
      "flying saucer",
      "flying_saucer"
    ],
    u: "1f6f8"
  },
  {
    n: [
      "bellhop_bell"
    ],
    u: "1f6ce-fe0f"
  },
  {
    n: [
      "door"
    ],
    u: "1f6aa"
  },
  {
    n: [
      "bed"
    ],
    u: "1f6cf-fe0f"
  },
  {
    n: [
      "couch_and_lamp"
    ],
    u: "1f6cb-fe0f"
  },
  {
    n: [
      "toilet"
    ],
    u: "1f6bd"
  },
  {
    n: [
      "shower"
    ],
    u: "1f6bf"
  },
  {
    n: [
      "bathtub"
    ],
    u: "1f6c1"
  },
  {
    n: [
      "hourglass"
    ],
    u: "231b"
  },
  {
    n: [
      "hourglass with flowing sand",
      "hourglass_flowing_sand"
    ],
    u: "23f3"
  },
  {
    n: [
      "watch"
    ],
    u: "231a"
  },
  {
    n: [
      "alarm clock",
      "alarm_clock"
    ],
    u: "23f0"
  },
  {
    n: [
      "stopwatch"
    ],
    u: "23f1-fe0f"
  },
  {
    n: [
      "timer_clock"
    ],
    u: "23f2-fe0f"
  },
  {
    n: [
      "mantelpiece_clock"
    ],
    u: "1f570-fe0f"
  },
  {
    n: [
      "clock face twelve oclock",
      "clock12"
    ],
    u: "1f55b"
  },
  {
    n: [
      "clock face twelve-thirty",
      "clock1230"
    ],
    u: "1f567"
  },
  {
    n: [
      "clock face one oclock",
      "clock1"
    ],
    u: "1f550"
  },
  {
    n: [
      "clock face one-thirty",
      "clock130"
    ],
    u: "1f55c"
  },
  {
    n: [
      "clock face two oclock",
      "clock2"
    ],
    u: "1f551"
  },
  {
    n: [
      "clock face two-thirty",
      "clock230"
    ],
    u: "1f55d"
  },
  {
    n: [
      "clock face three oclock",
      "clock3"
    ],
    u: "1f552"
  },
  {
    n: [
      "clock face three-thirty",
      "clock330"
    ],
    u: "1f55e"
  },
  {
    n: [
      "clock face four oclock",
      "clock4"
    ],
    u: "1f553"
  },
  {
    n: [
      "clock face four-thirty",
      "clock430"
    ],
    u: "1f55f"
  },
  {
    n: [
      "clock face five oclock",
      "clock5"
    ],
    u: "1f554"
  },
  {
    n: [
      "clock face five-thirty",
      "clock530"
    ],
    u: "1f560"
  },
  {
    n: [
      "clock face six oclock",
      "clock6"
    ],
    u: "1f555"
  },
  {
    n: [
      "clock face six-thirty",
      "clock630"
    ],
    u: "1f561"
  },
  {
    n: [
      "clock face seven oclock",
      "clock7"
    ],
    u: "1f556"
  },
  {
    n: [
      "clock face seven-thirty",
      "clock730"
    ],
    u: "1f562"
  },
  {
    n: [
      "clock face eight oclock",
      "clock8"
    ],
    u: "1f557"
  },
  {
    n: [
      "clock face eight-thirty",
      "clock830"
    ],
    u: "1f563"
  },
  {
    n: [
      "clock face nine oclock",
      "clock9"
    ],
    u: "1f558"
  },
  {
    n: [
      "clock face nine-thirty",
      "clock930"
    ],
    u: "1f564"
  },
  {
    n: [
      "clock face ten oclock",
      "clock10"
    ],
    u: "1f559"
  },
  {
    n: [
      "clock face ten-thirty",
      "clock1030"
    ],
    u: "1f565"
  },
  {
    n: [
      "clock face eleven oclock",
      "clock11"
    ],
    u: "1f55a"
  },
  {
    n: [
      "clock face eleven-thirty",
      "clock1130"
    ],
    u: "1f566"
  },
  {
    n: [
      "new moon symbol",
      "new_moon"
    ],
    u: "1f311"
  },
  {
    n: [
      "waxing crescent moon symbol",
      "waxing_crescent_moon"
    ],
    u: "1f312"
  },
  {
    n: [
      "first quarter moon symbol",
      "first_quarter_moon"
    ],
    u: "1f313"
  },
  {
    n: [
      "waxing gibbous moon symbol",
      "moon",
      "waxing_gibbous_moon"
    ],
    u: "1f314"
  },
  {
    n: [
      "full moon symbol",
      "full_moon"
    ],
    u: "1f315"
  },
  {
    n: [
      "waning gibbous moon symbol",
      "waning_gibbous_moon"
    ],
    u: "1f316"
  },
  {
    n: [
      "last quarter moon symbol",
      "last_quarter_moon"
    ],
    u: "1f317"
  },
  {
    n: [
      "waning crescent moon symbol",
      "waning_crescent_moon"
    ],
    u: "1f318"
  },
  {
    n: [
      "crescent moon",
      "crescent_moon"
    ],
    u: "1f319"
  },
  {
    n: [
      "new moon with face",
      "new_moon_with_face"
    ],
    u: "1f31a"
  },
  {
    n: [
      "first quarter moon with face",
      "first_quarter_moon_with_face"
    ],
    u: "1f31b"
  },
  {
    n: [
      "last quarter moon with face",
      "last_quarter_moon_with_face"
    ],
    u: "1f31c"
  },
  {
    n: [
      "thermometer"
    ],
    u: "1f321-fe0f"
  },
  {
    n: [
      "black sun with rays",
      "sunny"
    ],
    u: "2600-fe0f"
  },
  {
    n: [
      "full moon with face",
      "full_moon_with_face"
    ],
    u: "1f31d"
  },
  {
    n: [
      "sun with face",
      "sun_with_face"
    ],
    u: "1f31e"
  },
  {
    n: [
      "white medium star",
      "star"
    ],
    u: "2b50"
  },
  {
    n: [
      "glowing star",
      "star2"
    ],
    u: "1f31f"
  },
  {
    n: [
      "shooting star",
      "stars"
    ],
    u: "1f320"
  },
  {
    n: [
      "cloud"
    ],
    u: "2601-fe0f"
  },
  {
    n: [
      "sun behind cloud",
      "partly_sunny"
    ],
    u: "26c5"
  },
  {
    n: [
      "thunder_cloud_and_rain"
    ],
    u: "26c8-fe0f"
  },
  {
    n: [
      "mostly_sunny",
      "sun_small_cloud"
    ],
    u: "1f324-fe0f"
  },
  {
    n: [
      "barely_sunny",
      "sun_behind_cloud"
    ],
    u: "1f325-fe0f"
  },
  {
    n: [
      "partly_sunny_rain",
      "sun_behind_rain_cloud"
    ],
    u: "1f326-fe0f"
  },
  {
    n: [
      "rain_cloud"
    ],
    u: "1f327-fe0f"
  },
  {
    n: [
      "snow_cloud"
    ],
    u: "1f328-fe0f"
  },
  {
    n: [
      "lightning",
      "lightning_cloud"
    ],
    u: "1f329-fe0f"
  },
  {
    n: [
      "tornado",
      "tornado_cloud"
    ],
    u: "1f32a-fe0f"
  },
  {
    n: [
      "fog"
    ],
    u: "1f32b-fe0f"
  },
  {
    n: [
      "wind_blowing_face"
    ],
    u: "1f32c-fe0f"
  },
  {
    n: [
      "cyclone"
    ],
    u: "1f300"
  },
  {
    n: [
      "rainbow"
    ],
    u: "1f308"
  },
  {
    n: [
      "closed umbrella",
      "closed_umbrella"
    ],
    u: "1f302"
  },
  {
    n: [
      "umbrella"
    ],
    u: "2602-fe0f"
  },
  {
    n: [
      "umbrella with rain drops",
      "umbrella_with_rain_drops"
    ],
    u: "2614"
  },
  {
    n: [
      "umbrella_on_ground"
    ],
    u: "26f1-fe0f"
  },
  {
    n: [
      "high voltage sign",
      "zap"
    ],
    u: "26a1"
  },
  {
    n: [
      "snowflake"
    ],
    u: "2744-fe0f"
  },
  {
    n: [
      "snowman"
    ],
    u: "2603-fe0f"
  },
  {
    n: [
      "snowman without snow",
      "snowman_without_snow"
    ],
    u: "26c4"
  },
  {
    n: [
      "comet"
    ],
    u: "2604-fe0f"
  },
  {
    n: [
      "fire"
    ],
    u: "1f525"
  },
  {
    n: [
      "droplet"
    ],
    u: "1f4a7"
  },
  {
    n: [
      "water wave",
      "ocean"
    ],
    u: "1f30a"
  }
];
const objects$1 = [
  {
    n: [
      "speaker with cancellation stroke",
      "mute"
    ],
    u: "1f507"
  },
  {
    n: [
      "speaker"
    ],
    u: "1f508"
  },
  {
    n: [
      "speaker with one sound wave",
      "sound"
    ],
    u: "1f509"
  },
  {
    n: [
      "speaker with three sound waves",
      "loud_sound"
    ],
    u: "1f50a"
  },
  {
    n: [
      "public address loudspeaker",
      "loudspeaker"
    ],
    u: "1f4e2"
  },
  {
    n: [
      "cheering megaphone",
      "mega"
    ],
    u: "1f4e3"
  },
  {
    n: [
      "postal horn",
      "postal_horn"
    ],
    u: "1f4ef"
  },
  {
    n: [
      "bell"
    ],
    u: "1f514"
  },
  {
    n: [
      "bell with cancellation stroke",
      "no_bell"
    ],
    u: "1f515"
  },
  {
    n: [
      "musical score",
      "musical_score"
    ],
    u: "1f3bc"
  },
  {
    n: [
      "musical note",
      "musical_note"
    ],
    u: "1f3b5"
  },
  {
    n: [
      "multiple musical notes",
      "notes"
    ],
    u: "1f3b6"
  },
  {
    n: [
      "studio_microphone"
    ],
    u: "1f399-fe0f"
  },
  {
    n: [
      "level_slider"
    ],
    u: "1f39a-fe0f"
  },
  {
    n: [
      "control_knobs"
    ],
    u: "1f39b-fe0f"
  },
  {
    n: [
      "microphone"
    ],
    u: "1f3a4"
  },
  {
    n: [
      "headphone",
      "headphones"
    ],
    u: "1f3a7"
  },
  {
    n: [
      "radio"
    ],
    u: "1f4fb"
  },
  {
    n: [
      "saxophone"
    ],
    u: "1f3b7"
  },
  {
    n: [
      "guitar"
    ],
    u: "1f3b8"
  },
  {
    n: [
      "musical keyboard",
      "musical_keyboard"
    ],
    u: "1f3b9"
  },
  {
    n: [
      "trumpet"
    ],
    u: "1f3ba"
  },
  {
    n: [
      "violin"
    ],
    u: "1f3bb"
  },
  {
    n: [
      "drum with drumsticks",
      "drum_with_drumsticks"
    ],
    u: "1f941"
  },
  {
    n: [
      "mobile phone",
      "iphone"
    ],
    u: "1f4f1"
  },
  {
    n: [
      "mobile phone with rightwards arrow at left",
      "calling"
    ],
    u: "1f4f2"
  },
  {
    n: [
      "black telephone",
      "phone",
      "telephone"
    ],
    u: "260e-fe0f"
  },
  {
    n: [
      "telephone receiver",
      "telephone_receiver"
    ],
    u: "1f4de"
  },
  {
    n: [
      "pager"
    ],
    u: "1f4df"
  },
  {
    n: [
      "fax machine",
      "fax"
    ],
    u: "1f4e0"
  },
  {
    n: [
      "battery"
    ],
    u: "1f50b"
  },
  {
    n: [
      "electric plug",
      "electric_plug"
    ],
    u: "1f50c"
  },
  {
    n: [
      "personal computer",
      "computer"
    ],
    u: "1f4bb"
  },
  {
    n: [
      "desktop_computer"
    ],
    u: "1f5a5-fe0f"
  },
  {
    n: [
      "printer"
    ],
    u: "1f5a8-fe0f"
  },
  {
    n: [
      "keyboard"
    ],
    u: "2328-fe0f"
  },
  {
    n: [
      "three_button_mouse"
    ],
    u: "1f5b1-fe0f"
  },
  {
    n: [
      "trackball"
    ],
    u: "1f5b2-fe0f"
  },
  {
    n: [
      "minidisc"
    ],
    u: "1f4bd"
  },
  {
    n: [
      "floppy disk",
      "floppy_disk"
    ],
    u: "1f4be"
  },
  {
    n: [
      "optical disc",
      "cd"
    ],
    u: "1f4bf"
  },
  {
    n: [
      "dvd"
    ],
    u: "1f4c0"
  },
  {
    n: [
      "movie camera",
      "movie_camera"
    ],
    u: "1f3a5"
  },
  {
    n: [
      "film_frames"
    ],
    u: "1f39e-fe0f"
  },
  {
    n: [
      "film_projector"
    ],
    u: "1f4fd-fe0f"
  },
  {
    n: [
      "clapper board",
      "clapper"
    ],
    u: "1f3ac"
  },
  {
    n: [
      "television",
      "tv"
    ],
    u: "1f4fa"
  },
  {
    n: [
      "camera"
    ],
    u: "1f4f7"
  },
  {
    n: [
      "camera with flash",
      "camera_with_flash"
    ],
    u: "1f4f8"
  },
  {
    n: [
      "video camera",
      "video_camera"
    ],
    u: "1f4f9"
  },
  {
    n: [
      "videocassette",
      "vhs"
    ],
    u: "1f4fc"
  },
  {
    n: [
      "left-pointing magnifying glass",
      "mag"
    ],
    u: "1f50d"
  },
  {
    n: [
      "right-pointing magnifying glass",
      "mag_right"
    ],
    u: "1f50e"
  },
  {
    n: [
      "microscope"
    ],
    u: "1f52c"
  },
  {
    n: [
      "telescope"
    ],
    u: "1f52d"
  },
  {
    n: [
      "satellite antenna",
      "satellite_antenna"
    ],
    u: "1f4e1"
  },
  {
    n: [
      "candle"
    ],
    u: "1f56f-fe0f"
  },
  {
    n: [
      "electric light bulb",
      "bulb"
    ],
    u: "1f4a1"
  },
  {
    n: [
      "electric torch",
      "flashlight"
    ],
    u: "1f526"
  },
  {
    n: [
      "izakaya lantern",
      "izakaya_lantern",
      "lantern"
    ],
    u: "1f3ee"
  },
  {
    n: [
      "notebook with decorative cover",
      "notebook_with_decorative_cover"
    ],
    u: "1f4d4"
  },
  {
    n: [
      "closed book",
      "closed_book"
    ],
    u: "1f4d5"
  },
  {
    n: [
      "open book",
      "book",
      "open_book"
    ],
    u: "1f4d6"
  },
  {
    n: [
      "green book",
      "green_book"
    ],
    u: "1f4d7"
  },
  {
    n: [
      "blue book",
      "blue_book"
    ],
    u: "1f4d8"
  },
  {
    n: [
      "orange book",
      "orange_book"
    ],
    u: "1f4d9"
  },
  {
    n: [
      "books"
    ],
    u: "1f4da"
  },
  {
    n: [
      "notebook"
    ],
    u: "1f4d3"
  },
  {
    n: [
      "ledger"
    ],
    u: "1f4d2"
  },
  {
    n: [
      "page with curl",
      "page_with_curl"
    ],
    u: "1f4c3"
  },
  {
    n: [
      "scroll"
    ],
    u: "1f4dc"
  },
  {
    n: [
      "page facing up",
      "page_facing_up"
    ],
    u: "1f4c4"
  },
  {
    n: [
      "newspaper"
    ],
    u: "1f4f0"
  },
  {
    n: [
      "rolled_up_newspaper"
    ],
    u: "1f5de-fe0f"
  },
  {
    n: [
      "bookmark tabs",
      "bookmark_tabs"
    ],
    u: "1f4d1"
  },
  {
    n: [
      "bookmark"
    ],
    u: "1f516"
  },
  {
    n: [
      "label"
    ],
    u: "1f3f7-fe0f"
  },
  {
    n: [
      "money bag",
      "moneybag"
    ],
    u: "1f4b0"
  },
  {
    n: [
      "banknote with yen sign",
      "yen"
    ],
    u: "1f4b4"
  },
  {
    n: [
      "banknote with dollar sign",
      "dollar"
    ],
    u: "1f4b5"
  },
  {
    n: [
      "banknote with euro sign",
      "euro"
    ],
    u: "1f4b6"
  },
  {
    n: [
      "banknote with pound sign",
      "pound"
    ],
    u: "1f4b7"
  },
  {
    n: [
      "money with wings",
      "money_with_wings"
    ],
    u: "1f4b8"
  },
  {
    n: [
      "credit card",
      "credit_card"
    ],
    u: "1f4b3"
  },
  {
    n: [
      "chart with upwards trend and yen sign",
      "chart"
    ],
    u: "1f4b9"
  },
  {
    n: [
      "currency exchange",
      "currency_exchange"
    ],
    u: "1f4b1"
  },
  {
    n: [
      "heavy dollar sign",
      "heavy_dollar_sign"
    ],
    u: "1f4b2"
  },
  {
    n: [
      "envelope",
      "email"
    ],
    u: "2709-fe0f"
  },
  {
    n: [
      "e-mail symbol",
      "e-mail"
    ],
    u: "1f4e7"
  },
  {
    n: [
      "incoming envelope",
      "incoming_envelope"
    ],
    u: "1f4e8"
  },
  {
    n: [
      "envelope with downwards arrow above",
      "envelope_with_arrow"
    ],
    u: "1f4e9"
  },
  {
    n: [
      "outbox tray",
      "outbox_tray"
    ],
    u: "1f4e4"
  },
  {
    n: [
      "inbox tray",
      "inbox_tray"
    ],
    u: "1f4e5"
  },
  {
    n: [
      "package"
    ],
    u: "1f4e6"
  },
  {
    n: [
      "closed mailbox with raised flag",
      "mailbox"
    ],
    u: "1f4eb"
  },
  {
    n: [
      "closed mailbox with lowered flag",
      "mailbox_closed"
    ],
    u: "1f4ea"
  },
  {
    n: [
      "open mailbox with raised flag",
      "mailbox_with_mail"
    ],
    u: "1f4ec"
  },
  {
    n: [
      "open mailbox with lowered flag",
      "mailbox_with_no_mail"
    ],
    u: "1f4ed"
  },
  {
    n: [
      "postbox"
    ],
    u: "1f4ee"
  },
  {
    n: [
      "ballot_box_with_ballot"
    ],
    u: "1f5f3-fe0f"
  },
  {
    n: [
      "pencil",
      "pencil2"
    ],
    u: "270f-fe0f"
  },
  {
    n: [
      "black nib",
      "black_nib"
    ],
    u: "2712-fe0f"
  },
  {
    n: [
      "lower_left_fountain_pen"
    ],
    u: "1f58b-fe0f"
  },
  {
    n: [
      "lower_left_ballpoint_pen"
    ],
    u: "1f58a-fe0f"
  },
  {
    n: [
      "lower_left_paintbrush"
    ],
    u: "1f58c-fe0f"
  },
  {
    n: [
      "lower_left_crayon"
    ],
    u: "1f58d-fe0f"
  },
  {
    n: [
      "memo",
      "pencil"
    ],
    u: "1f4dd"
  },
  {
    n: [
      "briefcase"
    ],
    u: "1f4bc"
  },
  {
    n: [
      "file folder",
      "file_folder"
    ],
    u: "1f4c1"
  },
  {
    n: [
      "open file folder",
      "open_file_folder"
    ],
    u: "1f4c2"
  },
  {
    n: [
      "card_index_dividers"
    ],
    u: "1f5c2-fe0f"
  },
  {
    n: [
      "calendar",
      "date"
    ],
    u: "1f4c5"
  },
  {
    n: [
      "tear-off calendar",
      "calendar"
    ],
    u: "1f4c6"
  },
  {
    n: [
      "spiral_note_pad"
    ],
    u: "1f5d2-fe0f"
  },
  {
    n: [
      "spiral_calendar_pad"
    ],
    u: "1f5d3-fe0f"
  },
  {
    n: [
      "card index",
      "card_index"
    ],
    u: "1f4c7"
  },
  {
    n: [
      "chart with upwards trend",
      "chart_with_upwards_trend"
    ],
    u: "1f4c8"
  },
  {
    n: [
      "chart with downwards trend",
      "chart_with_downwards_trend"
    ],
    u: "1f4c9"
  },
  {
    n: [
      "bar chart",
      "bar_chart"
    ],
    u: "1f4ca"
  },
  {
    n: [
      "clipboard"
    ],
    u: "1f4cb"
  },
  {
    n: [
      "pushpin"
    ],
    u: "1f4cc"
  },
  {
    n: [
      "round pushpin",
      "round_pushpin"
    ],
    u: "1f4cd"
  },
  {
    n: [
      "paperclip"
    ],
    u: "1f4ce"
  },
  {
    n: [
      "linked_paperclips"
    ],
    u: "1f587-fe0f"
  },
  {
    n: [
      "straight ruler",
      "straight_ruler"
    ],
    u: "1f4cf"
  },
  {
    n: [
      "triangular ruler",
      "triangular_ruler"
    ],
    u: "1f4d0"
  },
  {
    n: [
      "black scissors",
      "scissors"
    ],
    u: "2702-fe0f"
  },
  {
    n: [
      "card_file_box"
    ],
    u: "1f5c3-fe0f"
  },
  {
    n: [
      "file_cabinet"
    ],
    u: "1f5c4-fe0f"
  },
  {
    n: [
      "wastebasket"
    ],
    u: "1f5d1-fe0f"
  },
  {
    n: [
      "lock"
    ],
    u: "1f512"
  },
  {
    n: [
      "open lock",
      "unlock"
    ],
    u: "1f513"
  },
  {
    n: [
      "lock with ink pen",
      "lock_with_ink_pen"
    ],
    u: "1f50f"
  },
  {
    n: [
      "closed lock with key",
      "closed_lock_with_key"
    ],
    u: "1f510"
  },
  {
    n: [
      "key"
    ],
    u: "1f511"
  },
  {
    n: [
      "old_key"
    ],
    u: "1f5dd-fe0f"
  },
  {
    n: [
      "hammer"
    ],
    u: "1f528"
  },
  {
    n: [
      "pick"
    ],
    u: "26cf-fe0f"
  },
  {
    n: [
      "hammer_and_pick"
    ],
    u: "2692-fe0f"
  },
  {
    n: [
      "hammer_and_wrench"
    ],
    u: "1f6e0-fe0f"
  },
  {
    n: [
      "dagger_knife"
    ],
    u: "1f5e1-fe0f"
  },
  {
    n: [
      "crossed_swords"
    ],
    u: "2694-fe0f"
  },
  {
    n: [
      "pistol",
      "gun"
    ],
    u: "1f52b"
  },
  {
    n: [
      "bow and arrow",
      "bow_and_arrow"
    ],
    u: "1f3f9"
  },
  {
    n: [
      "shield"
    ],
    u: "1f6e1-fe0f"
  },
  {
    n: [
      "wrench"
    ],
    u: "1f527"
  },
  {
    n: [
      "nut and bolt",
      "nut_and_bolt"
    ],
    u: "1f529"
  },
  {
    n: [
      "gear"
    ],
    u: "2699-fe0f"
  },
  {
    n: [
      "compression"
    ],
    u: "1f5dc-fe0f"
  },
  {
    n: [
      "alembic"
    ],
    u: "2697-fe0f"
  },
  {
    n: [
      "scales"
    ],
    u: "2696-fe0f"
  },
  {
    n: [
      "link symbol",
      "link"
    ],
    u: "1f517"
  },
  {
    n: [
      "chains"
    ],
    u: "26d3-fe0f"
  },
  {
    n: [
      "syringe"
    ],
    u: "1f489"
  },
  {
    n: [
      "pill"
    ],
    u: "1f48a"
  },
  {
    n: [
      "smoking symbol",
      "smoking"
    ],
    u: "1f6ac"
  },
  {
    n: [
      "coffin"
    ],
    u: "26b0-fe0f"
  },
  {
    n: [
      "funeral_urn"
    ],
    u: "26b1-fe0f"
  },
  {
    n: [
      "moyai"
    ],
    u: "1f5ff"
  },
  {
    n: [
      "oil_drum"
    ],
    u: "1f6e2-fe0f"
  },
  {
    n: [
      "crystal ball",
      "crystal_ball"
    ],
    u: "1f52e"
  },
  {
    n: [
      "shopping trolley",
      "shopping_trolley"
    ],
    u: "1f6d2"
  }
];
const symbols$1 = [
  {
    n: [
      "automated teller machine",
      "atm"
    ],
    u: "1f3e7"
  },
  {
    n: [
      "put litter in its place symbol",
      "put_litter_in_its_place"
    ],
    u: "1f6ae"
  },
  {
    n: [
      "potable water symbol",
      "potable_water"
    ],
    u: "1f6b0"
  },
  {
    n: [
      "wheelchair symbol",
      "wheelchair"
    ],
    u: "267f"
  },
  {
    n: [
      "mens symbol",
      "mens"
    ],
    u: "1f6b9"
  },
  {
    n: [
      "womens symbol",
      "womens"
    ],
    u: "1f6ba"
  },
  {
    n: [
      "restroom"
    ],
    u: "1f6bb"
  },
  {
    n: [
      "baby symbol",
      "baby_symbol"
    ],
    u: "1f6bc"
  },
  {
    n: [
      "water closet",
      "wc"
    ],
    u: "1f6be"
  },
  {
    n: [
      "passport control",
      "passport_control"
    ],
    u: "1f6c2"
  },
  {
    n: [
      "customs"
    ],
    u: "1f6c3"
  },
  {
    n: [
      "baggage claim",
      "baggage_claim"
    ],
    u: "1f6c4"
  },
  {
    n: [
      "left luggage",
      "left_luggage"
    ],
    u: "1f6c5"
  },
  {
    n: [
      "warning sign",
      "warning"
    ],
    u: "26a0-fe0f"
  },
  {
    n: [
      "children crossing",
      "children_crossing"
    ],
    u: "1f6b8"
  },
  {
    n: [
      "no entry",
      "no_entry"
    ],
    u: "26d4"
  },
  {
    n: [
      "no entry sign",
      "no_entry_sign"
    ],
    u: "1f6ab"
  },
  {
    n: [
      "no bicycles",
      "no_bicycles"
    ],
    u: "1f6b3"
  },
  {
    n: [
      "no smoking symbol",
      "no_smoking"
    ],
    u: "1f6ad"
  },
  {
    n: [
      "do not litter symbol",
      "do_not_litter"
    ],
    u: "1f6af"
  },
  {
    n: [
      "non-potable water symbol",
      "non-potable_water"
    ],
    u: "1f6b1"
  },
  {
    n: [
      "no pedestrians",
      "no_pedestrians"
    ],
    u: "1f6b7"
  },
  {
    n: [
      "no mobile phones",
      "no_mobile_phones"
    ],
    u: "1f4f5"
  },
  {
    n: [
      "no one under eighteen symbol",
      "underage"
    ],
    u: "1f51e"
  },
  {
    n: [
      "radioactive_sign"
    ],
    u: "2622-fe0f"
  },
  {
    n: [
      "biohazard_sign"
    ],
    u: "2623-fe0f"
  },
  {
    n: [
      "upwards black arrow",
      "arrow_up"
    ],
    u: "2b06-fe0f"
  },
  {
    n: [
      "north east arrow",
      "arrow_upper_right"
    ],
    u: "2197-fe0f"
  },
  {
    n: [
      "black rightwards arrow",
      "arrow_right"
    ],
    u: "27a1-fe0f"
  },
  {
    n: [
      "south east arrow",
      "arrow_lower_right"
    ],
    u: "2198-fe0f"
  },
  {
    n: [
      "downwards black arrow",
      "arrow_down"
    ],
    u: "2b07-fe0f"
  },
  {
    n: [
      "south west arrow",
      "arrow_lower_left"
    ],
    u: "2199-fe0f"
  },
  {
    n: [
      "leftwards black arrow",
      "arrow_left"
    ],
    u: "2b05-fe0f"
  },
  {
    n: [
      "north west arrow",
      "arrow_upper_left"
    ],
    u: "2196-fe0f"
  },
  {
    n: [
      "up down arrow",
      "arrow_up_down"
    ],
    u: "2195-fe0f"
  },
  {
    n: [
      "left right arrow",
      "left_right_arrow"
    ],
    u: "2194-fe0f"
  },
  {
    n: [
      "leftwards arrow with hook",
      "leftwards_arrow_with_hook"
    ],
    u: "21a9-fe0f"
  },
  {
    n: [
      "rightwards arrow with hook",
      "arrow_right_hook"
    ],
    u: "21aa-fe0f"
  },
  {
    n: [
      "arrow pointing rightwards then curving upwards",
      "arrow_heading_up"
    ],
    u: "2934-fe0f"
  },
  {
    n: [
      "arrow pointing rightwards then curving downwards",
      "arrow_heading_down"
    ],
    u: "2935-fe0f"
  },
  {
    n: [
      "clockwise downwards and upwards open circle arrows",
      "arrows_clockwise"
    ],
    u: "1f503"
  },
  {
    n: [
      "anticlockwise downwards and upwards open circle arrows",
      "arrows_counterclockwise"
    ],
    u: "1f504"
  },
  {
    n: [
      "back with leftwards arrow above",
      "back"
    ],
    u: "1f519"
  },
  {
    n: [
      "end with leftwards arrow above",
      "end"
    ],
    u: "1f51a"
  },
  {
    n: [
      "on with exclamation mark with left right arrow above",
      "on"
    ],
    u: "1f51b"
  },
  {
    n: [
      "soon with rightwards arrow above",
      "soon"
    ],
    u: "1f51c"
  },
  {
    n: [
      "top with upwards arrow above",
      "top"
    ],
    u: "1f51d"
  },
  {
    n: [
      "place of worship",
      "place_of_worship"
    ],
    u: "1f6d0"
  },
  {
    n: [
      "atom_symbol"
    ],
    u: "269b-fe0f"
  },
  {
    n: [
      "om_symbol"
    ],
    u: "1f549-fe0f"
  },
  {
    n: [
      "star_of_david"
    ],
    u: "2721-fe0f"
  },
  {
    n: [
      "wheel_of_dharma"
    ],
    u: "2638-fe0f"
  },
  {
    n: [
      "yin_yang"
    ],
    u: "262f-fe0f"
  },
  {
    n: [
      "latin_cross"
    ],
    u: "271d-fe0f"
  },
  {
    n: [
      "orthodox_cross"
    ],
    u: "2626-fe0f"
  },
  {
    n: [
      "star_and_crescent"
    ],
    u: "262a-fe0f"
  },
  {
    n: [
      "peace_symbol"
    ],
    u: "262e-fe0f"
  },
  {
    n: [
      "menorah with nine branches",
      "menorah_with_nine_branches"
    ],
    u: "1f54e"
  },
  {
    n: [
      "six pointed star with middle dot",
      "six_pointed_star"
    ],
    u: "1f52f"
  },
  {
    n: [
      "aries"
    ],
    u: "2648"
  },
  {
    n: [
      "taurus"
    ],
    u: "2649"
  },
  {
    n: [
      "gemini"
    ],
    u: "264a"
  },
  {
    n: [
      "cancer"
    ],
    u: "264b"
  },
  {
    n: [
      "leo"
    ],
    u: "264c"
  },
  {
    n: [
      "virgo"
    ],
    u: "264d"
  },
  {
    n: [
      "libra"
    ],
    u: "264e"
  },
  {
    n: [
      "scorpius"
    ],
    u: "264f"
  },
  {
    n: [
      "sagittarius"
    ],
    u: "2650"
  },
  {
    n: [
      "capricorn"
    ],
    u: "2651"
  },
  {
    n: [
      "aquarius"
    ],
    u: "2652"
  },
  {
    n: [
      "pisces"
    ],
    u: "2653"
  },
  {
    n: [
      "ophiuchus"
    ],
    u: "26ce"
  },
  {
    n: [
      "twisted rightwards arrows",
      "twisted_rightwards_arrows"
    ],
    u: "1f500"
  },
  {
    n: [
      "clockwise rightwards and leftwards open circle arrows",
      "repeat"
    ],
    u: "1f501"
  },
  {
    n: [
      "clockwise rightwards and leftwards open circle arrows with circled one overlay",
      "repeat_one"
    ],
    u: "1f502"
  },
  {
    n: [
      "black right-pointing triangle",
      "arrow_forward"
    ],
    u: "25b6-fe0f"
  },
  {
    n: [
      "black right-pointing double triangle",
      "fast_forward"
    ],
    u: "23e9"
  },
  {
    n: [
      "black_right_pointing_double_triangle_with_vertical_bar"
    ],
    u: "23ed-fe0f"
  },
  {
    n: [
      "black_right_pointing_triangle_with_double_vertical_bar"
    ],
    u: "23ef-fe0f"
  },
  {
    n: [
      "black left-pointing triangle",
      "arrow_backward"
    ],
    u: "25c0-fe0f"
  },
  {
    n: [
      "black left-pointing double triangle",
      "rewind"
    ],
    u: "23ea"
  },
  {
    n: [
      "black_left_pointing_double_triangle_with_vertical_bar"
    ],
    u: "23ee-fe0f"
  },
  {
    n: [
      "up-pointing small red triangle",
      "arrow_up_small"
    ],
    u: "1f53c"
  },
  {
    n: [
      "black up-pointing double triangle",
      "arrow_double_up"
    ],
    u: "23eb"
  },
  {
    n: [
      "down-pointing small red triangle",
      "arrow_down_small"
    ],
    u: "1f53d"
  },
  {
    n: [
      "black down-pointing double triangle",
      "arrow_double_down"
    ],
    u: "23ec"
  },
  {
    n: [
      "double_vertical_bar"
    ],
    u: "23f8-fe0f"
  },
  {
    n: [
      "black_square_for_stop"
    ],
    u: "23f9-fe0f"
  },
  {
    n: [
      "black_circle_for_record"
    ],
    u: "23fa-fe0f"
  },
  {
    n: [
      "eject"
    ],
    u: "23cf-fe0f"
  },
  {
    n: [
      "cinema"
    ],
    u: "1f3a6"
  },
  {
    n: [
      "low brightness symbol",
      "low_brightness"
    ],
    u: "1f505"
  },
  {
    n: [
      "high brightness symbol",
      "high_brightness"
    ],
    u: "1f506"
  },
  {
    n: [
      "antenna with bars",
      "signal_strength"
    ],
    u: "1f4f6"
  },
  {
    n: [
      "vibration mode",
      "vibration_mode"
    ],
    u: "1f4f3"
  },
  {
    n: [
      "mobile phone off",
      "mobile_phone_off"
    ],
    u: "1f4f4"
  },
  {
    n: [
      "female_sign"
    ],
    u: "2640-fe0f"
  },
  {
    n: [
      "male_sign"
    ],
    u: "2642-fe0f"
  },
  {
    n: [
      "medical_symbol",
      "staff_of_aesculapius"
    ],
    u: "2695-fe0f"
  },
  {
    n: [
      "black universal recycling symbol",
      "recycle"
    ],
    u: "267b-fe0f"
  },
  {
    n: [
      "fleur_de_lis"
    ],
    u: "269c-fe0f"
  },
  {
    n: [
      "trident emblem",
      "trident"
    ],
    u: "1f531"
  },
  {
    n: [
      "name badge",
      "name_badge"
    ],
    u: "1f4db"
  },
  {
    n: [
      "japanese symbol for beginner",
      "beginner"
    ],
    u: "1f530"
  },
  {
    n: [
      "heavy large circle",
      "o"
    ],
    u: "2b55"
  },
  {
    n: [
      "white heavy check mark",
      "white_check_mark"
    ],
    u: "2705"
  },
  {
    n: [
      "ballot box with check",
      "ballot_box_with_check"
    ],
    u: "2611-fe0f"
  },
  {
    n: [
      "heavy check mark",
      "heavy_check_mark"
    ],
    u: "2714-fe0f"
  },
  {
    n: [
      "heavy multiplication x",
      "heavy_multiplication_x"
    ],
    u: "2716-fe0f"
  },
  {
    n: [
      "cross mark",
      "x"
    ],
    u: "274c"
  },
  {
    n: [
      "negative squared cross mark",
      "negative_squared_cross_mark"
    ],
    u: "274e"
  },
  {
    n: [
      "heavy plus sign",
      "heavy_plus_sign"
    ],
    u: "2795"
  },
  {
    n: [
      "heavy minus sign",
      "heavy_minus_sign"
    ],
    u: "2796"
  },
  {
    n: [
      "heavy division sign",
      "heavy_division_sign"
    ],
    u: "2797"
  },
  {
    n: [
      "curly loop",
      "curly_loop"
    ],
    u: "27b0"
  },
  {
    n: [
      "double curly loop",
      "loop"
    ],
    u: "27bf"
  },
  {
    n: [
      "part alternation mark",
      "part_alternation_mark"
    ],
    u: "303d-fe0f"
  },
  {
    n: [
      "eight spoked asterisk",
      "eight_spoked_asterisk"
    ],
    u: "2733-fe0f"
  },
  {
    n: [
      "eight pointed black star",
      "eight_pointed_black_star"
    ],
    u: "2734-fe0f"
  },
  {
    n: [
      "sparkle"
    ],
    u: "2747-fe0f"
  },
  {
    n: [
      "double exclamation mark",
      "bangbang"
    ],
    u: "203c-fe0f"
  },
  {
    n: [
      "exclamation question mark",
      "interrobang"
    ],
    u: "2049-fe0f"
  },
  {
    n: [
      "black question mark ornament",
      "question"
    ],
    u: "2753"
  },
  {
    n: [
      "white question mark ornament",
      "grey_question"
    ],
    u: "2754"
  },
  {
    n: [
      "white exclamation mark ornament",
      "grey_exclamation"
    ],
    u: "2755"
  },
  {
    n: [
      "heavy exclamation mark symbol",
      "exclamation",
      "heavy_exclamation_mark"
    ],
    u: "2757"
  },
  {
    n: [
      "wavy dash",
      "wavy_dash"
    ],
    u: "3030-fe0f"
  },
  {
    n: [
      "copyright sign",
      "copyright"
    ],
    u: "00a9-fe0f"
  },
  {
    n: [
      "registered sign",
      "registered"
    ],
    u: "00ae-fe0f"
  },
  {
    n: [
      "trade mark sign",
      "tm"
    ],
    u: "2122-fe0f"
  },
  {
    n: [
      "hash key",
      "hash"
    ],
    u: "0023-fe0f-20e3"
  },
  {
    n: [
      "keycap_star"
    ],
    u: "002a-fe0f-20e3"
  },
  {
    n: [
      "keycap 0",
      "zero"
    ],
    u: "0030-fe0f-20e3"
  },
  {
    n: [
      "keycap 1",
      "one"
    ],
    u: "0031-fe0f-20e3"
  },
  {
    n: [
      "keycap 2",
      "two"
    ],
    u: "0032-fe0f-20e3"
  },
  {
    n: [
      "keycap 3",
      "three"
    ],
    u: "0033-fe0f-20e3"
  },
  {
    n: [
      "keycap 4",
      "four"
    ],
    u: "0034-fe0f-20e3"
  },
  {
    n: [
      "keycap 5",
      "five"
    ],
    u: "0035-fe0f-20e3"
  },
  {
    n: [
      "keycap 6",
      "six"
    ],
    u: "0036-fe0f-20e3"
  },
  {
    n: [
      "keycap 7",
      "seven"
    ],
    u: "0037-fe0f-20e3"
  },
  {
    n: [
      "keycap 8",
      "eight"
    ],
    u: "0038-fe0f-20e3"
  },
  {
    n: [
      "keycap 9",
      "nine"
    ],
    u: "0039-fe0f-20e3"
  },
  {
    n: [
      "keycap ten",
      "keycap_ten"
    ],
    u: "1f51f"
  },
  {
    n: [
      "hundred points symbol",
      "100"
    ],
    u: "1f4af"
  },
  {
    n: [
      "input symbol for latin capital letters",
      "capital_abcd"
    ],
    u: "1f520"
  },
  {
    n: [
      "input symbol for latin small letters",
      "abcd"
    ],
    u: "1f521"
  },
  {
    n: [
      "input symbol for numbers",
      "1234"
    ],
    u: "1f522"
  },
  {
    n: [
      "input symbol for symbols",
      "symbols"
    ],
    u: "1f523"
  },
  {
    n: [
      "input symbol for latin letters",
      "abc"
    ],
    u: "1f524"
  },
  {
    n: [
      "negative squared latin capital letter a",
      "a"
    ],
    u: "1f170-fe0f"
  },
  {
    n: [
      "negative squared ab",
      "ab"
    ],
    u: "1f18e"
  },
  {
    n: [
      "negative squared latin capital letter b",
      "b"
    ],
    u: "1f171-fe0f"
  },
  {
    n: [
      "squared cl",
      "cl"
    ],
    u: "1f191"
  },
  {
    n: [
      "squared cool",
      "cool"
    ],
    u: "1f192"
  },
  {
    n: [
      "squared free",
      "free"
    ],
    u: "1f193"
  },
  {
    n: [
      "information source",
      "information_source"
    ],
    u: "2139-fe0f"
  },
  {
    n: [
      "squared id",
      "id"
    ],
    u: "1f194"
  },
  {
    n: [
      "circled latin capital letter m",
      "m"
    ],
    u: "24c2-fe0f"
  },
  {
    n: [
      "squared new",
      "new"
    ],
    u: "1f195"
  },
  {
    n: [
      "squared ng",
      "ng"
    ],
    u: "1f196"
  },
  {
    n: [
      "negative squared latin capital letter o",
      "o2"
    ],
    u: "1f17e-fe0f"
  },
  {
    n: [
      "squared ok",
      "ok"
    ],
    u: "1f197"
  },
  {
    n: [
      "negative squared latin capital letter p",
      "parking"
    ],
    u: "1f17f-fe0f"
  },
  {
    n: [
      "squared sos",
      "sos"
    ],
    u: "1f198"
  },
  {
    n: [
      "squared up with exclamation mark",
      "up"
    ],
    u: "1f199"
  },
  {
    n: [
      "squared vs",
      "vs"
    ],
    u: "1f19a"
  },
  {
    n: [
      "squared katakana koko",
      "koko"
    ],
    u: "1f201"
  },
  {
    n: [
      "squared katakana sa",
      "sa"
    ],
    u: "1f202-fe0f"
  },
  {
    n: [
      "squared cjk unified ideograph-6708",
      "u6708"
    ],
    u: "1f237-fe0f"
  },
  {
    n: [
      "squared cjk unified ideograph-6709",
      "u6709"
    ],
    u: "1f236"
  },
  {
    n: [
      "squared cjk unified ideograph-6307",
      "u6307"
    ],
    u: "1f22f"
  },
  {
    n: [
      "circled ideograph advantage",
      "ideograph_advantage"
    ],
    u: "1f250"
  },
  {
    n: [
      "squared cjk unified ideograph-5272",
      "u5272"
    ],
    u: "1f239"
  },
  {
    n: [
      "squared cjk unified ideograph-7121",
      "u7121"
    ],
    u: "1f21a"
  },
  {
    n: [
      "squared cjk unified ideograph-7981",
      "u7981"
    ],
    u: "1f232"
  },
  {
    n: [
      "circled ideograph accept",
      "accept"
    ],
    u: "1f251"
  },
  {
    n: [
      "squared cjk unified ideograph-7533",
      "u7533"
    ],
    u: "1f238"
  },
  {
    n: [
      "squared cjk unified ideograph-5408",
      "u5408"
    ],
    u: "1f234"
  },
  {
    n: [
      "squared cjk unified ideograph-7a7a",
      "u7a7a"
    ],
    u: "1f233"
  },
  {
    n: [
      "circled ideograph congratulation",
      "congratulations"
    ],
    u: "3297-fe0f"
  },
  {
    n: [
      "circled ideograph secret",
      "secret"
    ],
    u: "3299-fe0f"
  },
  {
    n: [
      "squared cjk unified ideograph-55b6",
      "u55b6"
    ],
    u: "1f23a"
  },
  {
    n: [
      "squared cjk unified ideograph-6e80",
      "u6e80"
    ],
    u: "1f235"
  },
  {
    n: [
      "black small square",
      "black_small_square"
    ],
    u: "25aa-fe0f"
  },
  {
    n: [
      "white small square",
      "white_small_square"
    ],
    u: "25ab-fe0f"
  },
  {
    n: [
      "white medium square",
      "white_medium_square"
    ],
    u: "25fb-fe0f"
  },
  {
    n: [
      "black medium square",
      "black_medium_square"
    ],
    u: "25fc-fe0f"
  },
  {
    n: [
      "white medium small square",
      "white_medium_small_square"
    ],
    u: "25fd"
  },
  {
    n: [
      "black medium small square",
      "black_medium_small_square"
    ],
    u: "25fe"
  },
  {
    n: [
      "black large square",
      "black_large_square"
    ],
    u: "2b1b"
  },
  {
    n: [
      "white large square",
      "white_large_square"
    ],
    u: "2b1c"
  },
  {
    n: [
      "large orange diamond",
      "large_orange_diamond"
    ],
    u: "1f536"
  },
  {
    n: [
      "large blue diamond",
      "large_blue_diamond"
    ],
    u: "1f537"
  },
  {
    n: [
      "small orange diamond",
      "small_orange_diamond"
    ],
    u: "1f538"
  },
  {
    n: [
      "small blue diamond",
      "small_blue_diamond"
    ],
    u: "1f539"
  },
  {
    n: [
      "up-pointing red triangle",
      "small_red_triangle"
    ],
    u: "1f53a"
  },
  {
    n: [
      "down-pointing red triangle",
      "small_red_triangle_down"
    ],
    u: "1f53b"
  },
  {
    n: [
      "diamond shape with a dot inside",
      "diamond_shape_with_a_dot_inside"
    ],
    u: "1f4a0"
  },
  {
    n: [
      "radio button",
      "radio_button"
    ],
    u: "1f518"
  },
  {
    n: [
      "black square button",
      "black_square_button"
    ],
    u: "1f532"
  },
  {
    n: [
      "white square button",
      "white_square_button"
    ],
    u: "1f533"
  },
  {
    n: [
      "medium white circle",
      "white_circle"
    ],
    u: "26aa"
  },
  {
    n: [
      "medium black circle",
      "black_circle"
    ],
    u: "26ab"
  },
  {
    n: [
      "large red circle",
      "red_circle"
    ],
    u: "1f534"
  },
  {
    n: [
      "large blue circle",
      "large_blue_circle"
    ],
    u: "1f535"
  }
];
const flags$1 = [
  {
    n: [
      "chequered flag",
      "checkered_flag"
    ],
    u: "1f3c1"
  },
  {
    n: [
      "triangular flag on post",
      "triangular_flag_on_post"
    ],
    u: "1f6a9"
  },
  {
    n: [
      "crossed flags",
      "crossed_flags"
    ],
    u: "1f38c"
  },
  {
    n: [
      "waving black flag",
      "waving_black_flag"
    ],
    u: "1f3f4"
  },
  {
    n: [
      "waving_white_flag"
    ],
    u: "1f3f3-fe0f"
  },
  {
    n: [
      "rainbow-flag"
    ],
    u: "1f3f3-fe0f-200d-1f308"
  },
  {
    n: [
      "ascension island flag",
      "flag-ac"
    ],
    u: "1f1e6-1f1e8"
  },
  {
    n: [
      "andorra flag",
      "flag-ad"
    ],
    u: "1f1e6-1f1e9"
  },
  {
    n: [
      "united arab emirates flag",
      "flag-ae"
    ],
    u: "1f1e6-1f1ea"
  },
  {
    n: [
      "afghanistan flag",
      "flag-af"
    ],
    u: "1f1e6-1f1eb"
  },
  {
    n: [
      "antigua & barbuda flag",
      "flag-ag"
    ],
    u: "1f1e6-1f1ec"
  },
  {
    n: [
      "anguilla flag",
      "flag-ai"
    ],
    u: "1f1e6-1f1ee"
  },
  {
    n: [
      "albania flag",
      "flag-al"
    ],
    u: "1f1e6-1f1f1"
  },
  {
    n: [
      "armenia flag",
      "flag-am"
    ],
    u: "1f1e6-1f1f2"
  },
  {
    n: [
      "angola flag",
      "flag-ao"
    ],
    u: "1f1e6-1f1f4"
  },
  {
    n: [
      "antarctica flag",
      "flag-aq"
    ],
    u: "1f1e6-1f1f6"
  },
  {
    n: [
      "argentina flag",
      "flag-ar"
    ],
    u: "1f1e6-1f1f7"
  },
  {
    n: [
      "american samoa flag",
      "flag-as"
    ],
    u: "1f1e6-1f1f8"
  },
  {
    n: [
      "austria flag",
      "flag-at"
    ],
    u: "1f1e6-1f1f9"
  },
  {
    n: [
      "australia flag",
      "flag-au"
    ],
    u: "1f1e6-1f1fa"
  },
  {
    n: [
      "aruba flag",
      "flag-aw"
    ],
    u: "1f1e6-1f1fc"
  },
  {
    n: [
      "\xE5land islands flag",
      "flag-ax"
    ],
    u: "1f1e6-1f1fd"
  },
  {
    n: [
      "azerbaijan flag",
      "flag-az"
    ],
    u: "1f1e6-1f1ff"
  },
  {
    n: [
      "bosnia & herzegovina flag",
      "flag-ba"
    ],
    u: "1f1e7-1f1e6"
  },
  {
    n: [
      "barbados flag",
      "flag-bb"
    ],
    u: "1f1e7-1f1e7"
  },
  {
    n: [
      "bangladesh flag",
      "flag-bd"
    ],
    u: "1f1e7-1f1e9"
  },
  {
    n: [
      "belgium flag",
      "flag-be"
    ],
    u: "1f1e7-1f1ea"
  },
  {
    n: [
      "burkina faso flag",
      "flag-bf"
    ],
    u: "1f1e7-1f1eb"
  },
  {
    n: [
      "bulgaria flag",
      "flag-bg"
    ],
    u: "1f1e7-1f1ec"
  },
  {
    n: [
      "bahrain flag",
      "flag-bh"
    ],
    u: "1f1e7-1f1ed"
  },
  {
    n: [
      "burundi flag",
      "flag-bi"
    ],
    u: "1f1e7-1f1ee"
  },
  {
    n: [
      "benin flag",
      "flag-bj"
    ],
    u: "1f1e7-1f1ef"
  },
  {
    n: [
      "st. barth\xE9lemy flag",
      "flag-bl"
    ],
    u: "1f1e7-1f1f1"
  },
  {
    n: [
      "bermuda flag",
      "flag-bm"
    ],
    u: "1f1e7-1f1f2"
  },
  {
    n: [
      "brunei flag",
      "flag-bn"
    ],
    u: "1f1e7-1f1f3"
  },
  {
    n: [
      "bolivia flag",
      "flag-bo"
    ],
    u: "1f1e7-1f1f4"
  },
  {
    n: [
      "caribbean netherlands flag",
      "flag-bq"
    ],
    u: "1f1e7-1f1f6"
  },
  {
    n: [
      "brazil flag",
      "flag-br"
    ],
    u: "1f1e7-1f1f7"
  },
  {
    n: [
      "bahamas flag",
      "flag-bs"
    ],
    u: "1f1e7-1f1f8"
  },
  {
    n: [
      "bhutan flag",
      "flag-bt"
    ],
    u: "1f1e7-1f1f9"
  },
  {
    n: [
      "bouvet island flag",
      "flag-bv"
    ],
    u: "1f1e7-1f1fb"
  },
  {
    n: [
      "botswana flag",
      "flag-bw"
    ],
    u: "1f1e7-1f1fc"
  },
  {
    n: [
      "belarus flag",
      "flag-by"
    ],
    u: "1f1e7-1f1fe"
  },
  {
    n: [
      "belize flag",
      "flag-bz"
    ],
    u: "1f1e7-1f1ff"
  },
  {
    n: [
      "canada flag",
      "flag-ca"
    ],
    u: "1f1e8-1f1e6"
  },
  {
    n: [
      "cocos (keeling) islands flag",
      "flag-cc"
    ],
    u: "1f1e8-1f1e8"
  },
  {
    n: [
      "congo - kinshasa flag",
      "flag-cd"
    ],
    u: "1f1e8-1f1e9"
  },
  {
    n: [
      "central african republic flag",
      "flag-cf"
    ],
    u: "1f1e8-1f1eb"
  },
  {
    n: [
      "congo - brazzaville flag",
      "flag-cg"
    ],
    u: "1f1e8-1f1ec"
  },
  {
    n: [
      "switzerland flag",
      "flag-ch"
    ],
    u: "1f1e8-1f1ed"
  },
  {
    n: [
      "c\xF4te d\u2019ivoire flag",
      "flag-ci"
    ],
    u: "1f1e8-1f1ee"
  },
  {
    n: [
      "cook islands flag",
      "flag-ck"
    ],
    u: "1f1e8-1f1f0"
  },
  {
    n: [
      "chile flag",
      "flag-cl"
    ],
    u: "1f1e8-1f1f1"
  },
  {
    n: [
      "cameroon flag",
      "flag-cm"
    ],
    u: "1f1e8-1f1f2"
  },
  {
    n: [
      "china flag",
      "cn",
      "flag-cn"
    ],
    u: "1f1e8-1f1f3"
  },
  {
    n: [
      "colombia flag",
      "flag-co"
    ],
    u: "1f1e8-1f1f4"
  },
  {
    n: [
      "clipperton island flag",
      "flag-cp"
    ],
    u: "1f1e8-1f1f5"
  },
  {
    n: [
      "costa rica flag",
      "flag-cr"
    ],
    u: "1f1e8-1f1f7"
  },
  {
    n: [
      "cuba flag",
      "flag-cu"
    ],
    u: "1f1e8-1f1fa"
  },
  {
    n: [
      "cape verde flag",
      "flag-cv"
    ],
    u: "1f1e8-1f1fb"
  },
  {
    n: [
      "cura\xE7ao flag",
      "flag-cw"
    ],
    u: "1f1e8-1f1fc"
  },
  {
    n: [
      "christmas island flag",
      "flag-cx"
    ],
    u: "1f1e8-1f1fd"
  },
  {
    n: [
      "cyprus flag",
      "flag-cy"
    ],
    u: "1f1e8-1f1fe"
  },
  {
    n: [
      "czechia flag",
      "flag-cz"
    ],
    u: "1f1e8-1f1ff"
  },
  {
    n: [
      "germany flag",
      "de",
      "flag-de"
    ],
    u: "1f1e9-1f1ea"
  },
  {
    n: [
      "diego garcia flag",
      "flag-dg"
    ],
    u: "1f1e9-1f1ec"
  },
  {
    n: [
      "djibouti flag",
      "flag-dj"
    ],
    u: "1f1e9-1f1ef"
  },
  {
    n: [
      "denmark flag",
      "flag-dk"
    ],
    u: "1f1e9-1f1f0"
  },
  {
    n: [
      "dominica flag",
      "flag-dm"
    ],
    u: "1f1e9-1f1f2"
  },
  {
    n: [
      "dominican republic flag",
      "flag-do"
    ],
    u: "1f1e9-1f1f4"
  },
  {
    n: [
      "algeria flag",
      "flag-dz"
    ],
    u: "1f1e9-1f1ff"
  },
  {
    n: [
      "ceuta & melilla flag",
      "flag-ea"
    ],
    u: "1f1ea-1f1e6"
  },
  {
    n: [
      "ecuador flag",
      "flag-ec"
    ],
    u: "1f1ea-1f1e8"
  },
  {
    n: [
      "estonia flag",
      "flag-ee"
    ],
    u: "1f1ea-1f1ea"
  },
  {
    n: [
      "egypt flag",
      "flag-eg"
    ],
    u: "1f1ea-1f1ec"
  },
  {
    n: [
      "western sahara flag",
      "flag-eh"
    ],
    u: "1f1ea-1f1ed"
  },
  {
    n: [
      "eritrea flag",
      "flag-er"
    ],
    u: "1f1ea-1f1f7"
  },
  {
    n: [
      "spain flag",
      "es",
      "flag-es"
    ],
    u: "1f1ea-1f1f8"
  },
  {
    n: [
      "ethiopia flag",
      "flag-et"
    ],
    u: "1f1ea-1f1f9"
  },
  {
    n: [
      "european union flag",
      "flag-eu"
    ],
    u: "1f1ea-1f1fa"
  },
  {
    n: [
      "finland flag",
      "flag-fi"
    ],
    u: "1f1eb-1f1ee"
  },
  {
    n: [
      "fiji flag",
      "flag-fj"
    ],
    u: "1f1eb-1f1ef"
  },
  {
    n: [
      "falkland islands flag",
      "flag-fk"
    ],
    u: "1f1eb-1f1f0"
  },
  {
    n: [
      "micronesia flag",
      "flag-fm"
    ],
    u: "1f1eb-1f1f2"
  },
  {
    n: [
      "faroe islands flag",
      "flag-fo"
    ],
    u: "1f1eb-1f1f4"
  },
  {
    n: [
      "france flag",
      "fr",
      "flag-fr"
    ],
    u: "1f1eb-1f1f7"
  },
  {
    n: [
      "gabon flag",
      "flag-ga"
    ],
    u: "1f1ec-1f1e6"
  },
  {
    n: [
      "united kingdom flag",
      "gb",
      "uk",
      "flag-gb"
    ],
    u: "1f1ec-1f1e7"
  },
  {
    n: [
      "grenada flag",
      "flag-gd"
    ],
    u: "1f1ec-1f1e9"
  },
  {
    n: [
      "georgia flag",
      "flag-ge"
    ],
    u: "1f1ec-1f1ea"
  },
  {
    n: [
      "french guiana flag",
      "flag-gf"
    ],
    u: "1f1ec-1f1eb"
  },
  {
    n: [
      "guernsey flag",
      "flag-gg"
    ],
    u: "1f1ec-1f1ec"
  },
  {
    n: [
      "ghana flag",
      "flag-gh"
    ],
    u: "1f1ec-1f1ed"
  },
  {
    n: [
      "gibraltar flag",
      "flag-gi"
    ],
    u: "1f1ec-1f1ee"
  },
  {
    n: [
      "greenland flag",
      "flag-gl"
    ],
    u: "1f1ec-1f1f1"
  },
  {
    n: [
      "gambia flag",
      "flag-gm"
    ],
    u: "1f1ec-1f1f2"
  },
  {
    n: [
      "guinea flag",
      "flag-gn"
    ],
    u: "1f1ec-1f1f3"
  },
  {
    n: [
      "guadeloupe flag",
      "flag-gp"
    ],
    u: "1f1ec-1f1f5"
  },
  {
    n: [
      "equatorial guinea flag",
      "flag-gq"
    ],
    u: "1f1ec-1f1f6"
  },
  {
    n: [
      "greece flag",
      "flag-gr"
    ],
    u: "1f1ec-1f1f7"
  },
  {
    n: [
      "south georgia & south sandwich islands flag",
      "flag-gs"
    ],
    u: "1f1ec-1f1f8"
  },
  {
    n: [
      "guatemala flag",
      "flag-gt"
    ],
    u: "1f1ec-1f1f9"
  },
  {
    n: [
      "guam flag",
      "flag-gu"
    ],
    u: "1f1ec-1f1fa"
  },
  {
    n: [
      "guinea-bissau flag",
      "flag-gw"
    ],
    u: "1f1ec-1f1fc"
  },
  {
    n: [
      "guyana flag",
      "flag-gy"
    ],
    u: "1f1ec-1f1fe"
  },
  {
    n: [
      "hong kong sar china flag",
      "flag-hk"
    ],
    u: "1f1ed-1f1f0"
  },
  {
    n: [
      "heard & mcdonald islands flag",
      "flag-hm"
    ],
    u: "1f1ed-1f1f2"
  },
  {
    n: [
      "honduras flag",
      "flag-hn"
    ],
    u: "1f1ed-1f1f3"
  },
  {
    n: [
      "croatia flag",
      "flag-hr"
    ],
    u: "1f1ed-1f1f7"
  },
  {
    n: [
      "haiti flag",
      "flag-ht"
    ],
    u: "1f1ed-1f1f9"
  },
  {
    n: [
      "hungary flag",
      "flag-hu"
    ],
    u: "1f1ed-1f1fa"
  },
  {
    n: [
      "canary islands flag",
      "flag-ic"
    ],
    u: "1f1ee-1f1e8"
  },
  {
    n: [
      "indonesia flag",
      "flag-id"
    ],
    u: "1f1ee-1f1e9"
  },
  {
    n: [
      "ireland flag",
      "flag-ie"
    ],
    u: "1f1ee-1f1ea"
  },
  {
    n: [
      "israel flag",
      "flag-il"
    ],
    u: "1f1ee-1f1f1"
  },
  {
    n: [
      "isle of man flag",
      "flag-im"
    ],
    u: "1f1ee-1f1f2"
  },
  {
    n: [
      "india flag",
      "flag-in"
    ],
    u: "1f1ee-1f1f3"
  },
  {
    n: [
      "british indian ocean territory flag",
      "flag-io"
    ],
    u: "1f1ee-1f1f4"
  },
  {
    n: [
      "iraq flag",
      "flag-iq"
    ],
    u: "1f1ee-1f1f6"
  },
  {
    n: [
      "iran flag",
      "flag-ir"
    ],
    u: "1f1ee-1f1f7"
  },
  {
    n: [
      "iceland flag",
      "flag-is"
    ],
    u: "1f1ee-1f1f8"
  },
  {
    n: [
      "italy flag",
      "it",
      "flag-it"
    ],
    u: "1f1ee-1f1f9"
  },
  {
    n: [
      "jersey flag",
      "flag-je"
    ],
    u: "1f1ef-1f1ea"
  },
  {
    n: [
      "jamaica flag",
      "flag-jm"
    ],
    u: "1f1ef-1f1f2"
  },
  {
    n: [
      "jordan flag",
      "flag-jo"
    ],
    u: "1f1ef-1f1f4"
  },
  {
    n: [
      "japan flag",
      "jp",
      "flag-jp"
    ],
    u: "1f1ef-1f1f5"
  },
  {
    n: [
      "kenya flag",
      "flag-ke"
    ],
    u: "1f1f0-1f1ea"
  },
  {
    n: [
      "kyrgyzstan flag",
      "flag-kg"
    ],
    u: "1f1f0-1f1ec"
  },
  {
    n: [
      "cambodia flag",
      "flag-kh"
    ],
    u: "1f1f0-1f1ed"
  },
  {
    n: [
      "kiribati flag",
      "flag-ki"
    ],
    u: "1f1f0-1f1ee"
  },
  {
    n: [
      "comoros flag",
      "flag-km"
    ],
    u: "1f1f0-1f1f2"
  },
  {
    n: [
      "st. kitts & nevis flag",
      "flag-kn"
    ],
    u: "1f1f0-1f1f3"
  },
  {
    n: [
      "north korea flag",
      "flag-kp"
    ],
    u: "1f1f0-1f1f5"
  },
  {
    n: [
      "south korea flag",
      "kr",
      "flag-kr"
    ],
    u: "1f1f0-1f1f7"
  },
  {
    n: [
      "kuwait flag",
      "flag-kw"
    ],
    u: "1f1f0-1f1fc"
  },
  {
    n: [
      "cayman islands flag",
      "flag-ky"
    ],
    u: "1f1f0-1f1fe"
  },
  {
    n: [
      "kazakhstan flag",
      "flag-kz"
    ],
    u: "1f1f0-1f1ff"
  },
  {
    n: [
      "laos flag",
      "flag-la"
    ],
    u: "1f1f1-1f1e6"
  },
  {
    n: [
      "lebanon flag",
      "flag-lb"
    ],
    u: "1f1f1-1f1e7"
  },
  {
    n: [
      "st. lucia flag",
      "flag-lc"
    ],
    u: "1f1f1-1f1e8"
  },
  {
    n: [
      "liechtenstein flag",
      "flag-li"
    ],
    u: "1f1f1-1f1ee"
  },
  {
    n: [
      "sri lanka flag",
      "flag-lk"
    ],
    u: "1f1f1-1f1f0"
  },
  {
    n: [
      "liberia flag",
      "flag-lr"
    ],
    u: "1f1f1-1f1f7"
  },
  {
    n: [
      "lesotho flag",
      "flag-ls"
    ],
    u: "1f1f1-1f1f8"
  },
  {
    n: [
      "lithuania flag",
      "flag-lt"
    ],
    u: "1f1f1-1f1f9"
  },
  {
    n: [
      "luxembourg flag",
      "flag-lu"
    ],
    u: "1f1f1-1f1fa"
  },
  {
    n: [
      "latvia flag",
      "flag-lv"
    ],
    u: "1f1f1-1f1fb"
  },
  {
    n: [
      "libya flag",
      "flag-ly"
    ],
    u: "1f1f1-1f1fe"
  },
  {
    n: [
      "morocco flag",
      "flag-ma"
    ],
    u: "1f1f2-1f1e6"
  },
  {
    n: [
      "monaco flag",
      "flag-mc"
    ],
    u: "1f1f2-1f1e8"
  },
  {
    n: [
      "moldova flag",
      "flag-md"
    ],
    u: "1f1f2-1f1e9"
  },
  {
    n: [
      "montenegro flag",
      "flag-me"
    ],
    u: "1f1f2-1f1ea"
  },
  {
    n: [
      "st. martin flag",
      "flag-mf"
    ],
    u: "1f1f2-1f1eb"
  },
  {
    n: [
      "madagascar flag",
      "flag-mg"
    ],
    u: "1f1f2-1f1ec"
  },
  {
    n: [
      "marshall islands flag",
      "flag-mh"
    ],
    u: "1f1f2-1f1ed"
  },
  {
    n: [
      "macedonia flag",
      "flag-mk"
    ],
    u: "1f1f2-1f1f0"
  },
  {
    n: [
      "mali flag",
      "flag-ml"
    ],
    u: "1f1f2-1f1f1"
  },
  {
    n: [
      "myanmar (burma) flag",
      "flag-mm"
    ],
    u: "1f1f2-1f1f2"
  },
  {
    n: [
      "mongolia flag",
      "flag-mn"
    ],
    u: "1f1f2-1f1f3"
  },
  {
    n: [
      "macau sar china flag",
      "flag-mo"
    ],
    u: "1f1f2-1f1f4"
  },
  {
    n: [
      "northern mariana islands flag",
      "flag-mp"
    ],
    u: "1f1f2-1f1f5"
  },
  {
    n: [
      "martinique flag",
      "flag-mq"
    ],
    u: "1f1f2-1f1f6"
  },
  {
    n: [
      "mauritania flag",
      "flag-mr"
    ],
    u: "1f1f2-1f1f7"
  },
  {
    n: [
      "montserrat flag",
      "flag-ms"
    ],
    u: "1f1f2-1f1f8"
  },
  {
    n: [
      "malta flag",
      "flag-mt"
    ],
    u: "1f1f2-1f1f9"
  },
  {
    n: [
      "mauritius flag",
      "flag-mu"
    ],
    u: "1f1f2-1f1fa"
  },
  {
    n: [
      "maldives flag",
      "flag-mv"
    ],
    u: "1f1f2-1f1fb"
  },
  {
    n: [
      "malawi flag",
      "flag-mw"
    ],
    u: "1f1f2-1f1fc"
  },
  {
    n: [
      "mexico flag",
      "flag-mx"
    ],
    u: "1f1f2-1f1fd"
  },
  {
    n: [
      "malaysia flag",
      "flag-my"
    ],
    u: "1f1f2-1f1fe"
  },
  {
    n: [
      "mozambique flag",
      "flag-mz"
    ],
    u: "1f1f2-1f1ff"
  },
  {
    n: [
      "namibia flag",
      "flag-na"
    ],
    u: "1f1f3-1f1e6"
  },
  {
    n: [
      "new caledonia flag",
      "flag-nc"
    ],
    u: "1f1f3-1f1e8"
  },
  {
    n: [
      "niger flag",
      "flag-ne"
    ],
    u: "1f1f3-1f1ea"
  },
  {
    n: [
      "norfolk island flag",
      "flag-nf"
    ],
    u: "1f1f3-1f1eb"
  },
  {
    n: [
      "nigeria flag",
      "flag-ng"
    ],
    u: "1f1f3-1f1ec"
  },
  {
    n: [
      "nicaragua flag",
      "flag-ni"
    ],
    u: "1f1f3-1f1ee"
  },
  {
    n: [
      "netherlands flag",
      "flag-nl"
    ],
    u: "1f1f3-1f1f1"
  },
  {
    n: [
      "norway flag",
      "flag-no"
    ],
    u: "1f1f3-1f1f4"
  },
  {
    n: [
      "nepal flag",
      "flag-np"
    ],
    u: "1f1f3-1f1f5"
  },
  {
    n: [
      "nauru flag",
      "flag-nr"
    ],
    u: "1f1f3-1f1f7"
  },
  {
    n: [
      "niue flag",
      "flag-nu"
    ],
    u: "1f1f3-1f1fa"
  },
  {
    n: [
      "new zealand flag",
      "flag-nz"
    ],
    u: "1f1f3-1f1ff"
  },
  {
    n: [
      "oman flag",
      "flag-om"
    ],
    u: "1f1f4-1f1f2"
  },
  {
    n: [
      "panama flag",
      "flag-pa"
    ],
    u: "1f1f5-1f1e6"
  },
  {
    n: [
      "peru flag",
      "flag-pe"
    ],
    u: "1f1f5-1f1ea"
  },
  {
    n: [
      "french polynesia flag",
      "flag-pf"
    ],
    u: "1f1f5-1f1eb"
  },
  {
    n: [
      "papua new guinea flag",
      "flag-pg"
    ],
    u: "1f1f5-1f1ec"
  },
  {
    n: [
      "philippines flag",
      "flag-ph"
    ],
    u: "1f1f5-1f1ed"
  },
  {
    n: [
      "pakistan flag",
      "flag-pk"
    ],
    u: "1f1f5-1f1f0"
  },
  {
    n: [
      "poland flag",
      "flag-pl"
    ],
    u: "1f1f5-1f1f1"
  },
  {
    n: [
      "st. pierre & miquelon flag",
      "flag-pm"
    ],
    u: "1f1f5-1f1f2"
  },
  {
    n: [
      "pitcairn islands flag",
      "flag-pn"
    ],
    u: "1f1f5-1f1f3"
  },
  {
    n: [
      "puerto rico flag",
      "flag-pr"
    ],
    u: "1f1f5-1f1f7"
  },
  {
    n: [
      "palestinian territories flag",
      "flag-ps"
    ],
    u: "1f1f5-1f1f8"
  },
  {
    n: [
      "portugal flag",
      "flag-pt"
    ],
    u: "1f1f5-1f1f9"
  },
  {
    n: [
      "palau flag",
      "flag-pw"
    ],
    u: "1f1f5-1f1fc"
  },
  {
    n: [
      "paraguay flag",
      "flag-py"
    ],
    u: "1f1f5-1f1fe"
  },
  {
    n: [
      "qatar flag",
      "flag-qa"
    ],
    u: "1f1f6-1f1e6"
  },
  {
    n: [
      "r\xE9union flag",
      "flag-re"
    ],
    u: "1f1f7-1f1ea"
  },
  {
    n: [
      "romania flag",
      "flag-ro"
    ],
    u: "1f1f7-1f1f4"
  },
  {
    n: [
      "serbia flag",
      "flag-rs"
    ],
    u: "1f1f7-1f1f8"
  },
  {
    n: [
      "russia flag",
      "ru",
      "flag-ru"
    ],
    u: "1f1f7-1f1fa"
  },
  {
    n: [
      "rwanda flag",
      "flag-rw"
    ],
    u: "1f1f7-1f1fc"
  },
  {
    n: [
      "saudi arabia flag",
      "flag-sa"
    ],
    u: "1f1f8-1f1e6"
  },
  {
    n: [
      "solomon islands flag",
      "flag-sb"
    ],
    u: "1f1f8-1f1e7"
  },
  {
    n: [
      "seychelles flag",
      "flag-sc"
    ],
    u: "1f1f8-1f1e8"
  },
  {
    n: [
      "sudan flag",
      "flag-sd"
    ],
    u: "1f1f8-1f1e9"
  },
  {
    n: [
      "sweden flag",
      "flag-se"
    ],
    u: "1f1f8-1f1ea"
  },
  {
    n: [
      "singapore flag",
      "flag-sg"
    ],
    u: "1f1f8-1f1ec"
  },
  {
    n: [
      "st. helena flag",
      "flag-sh"
    ],
    u: "1f1f8-1f1ed"
  },
  {
    n: [
      "slovenia flag",
      "flag-si"
    ],
    u: "1f1f8-1f1ee"
  },
  {
    n: [
      "svalbard & jan mayen flag",
      "flag-sj"
    ],
    u: "1f1f8-1f1ef"
  },
  {
    n: [
      "slovakia flag",
      "flag-sk"
    ],
    u: "1f1f8-1f1f0"
  },
  {
    n: [
      "sierra leone flag",
      "flag-sl"
    ],
    u: "1f1f8-1f1f1"
  },
  {
    n: [
      "san marino flag",
      "flag-sm"
    ],
    u: "1f1f8-1f1f2"
  },
  {
    n: [
      "senegal flag",
      "flag-sn"
    ],
    u: "1f1f8-1f1f3"
  },
  {
    n: [
      "somalia flag",
      "flag-so"
    ],
    u: "1f1f8-1f1f4"
  },
  {
    n: [
      "suriname flag",
      "flag-sr"
    ],
    u: "1f1f8-1f1f7"
  },
  {
    n: [
      "south sudan flag",
      "flag-ss"
    ],
    u: "1f1f8-1f1f8"
  },
  {
    n: [
      "s\xE3o tom\xE9 & pr\xEDncipe flag",
      "flag-st"
    ],
    u: "1f1f8-1f1f9"
  },
  {
    n: [
      "el salvador flag",
      "flag-sv"
    ],
    u: "1f1f8-1f1fb"
  },
  {
    n: [
      "sint maarten flag",
      "flag-sx"
    ],
    u: "1f1f8-1f1fd"
  },
  {
    n: [
      "syria flag",
      "flag-sy"
    ],
    u: "1f1f8-1f1fe"
  },
  {
    n: [
      "swaziland flag",
      "flag-sz"
    ],
    u: "1f1f8-1f1ff"
  },
  {
    n: [
      "tristan da cunha flag",
      "flag-ta"
    ],
    u: "1f1f9-1f1e6"
  },
  {
    n: [
      "turks & caicos islands flag",
      "flag-tc"
    ],
    u: "1f1f9-1f1e8"
  },
  {
    n: [
      "chad flag",
      "flag-td"
    ],
    u: "1f1f9-1f1e9"
  },
  {
    n: [
      "french southern territories flag",
      "flag-tf"
    ],
    u: "1f1f9-1f1eb"
  },
  {
    n: [
      "togo flag",
      "flag-tg"
    ],
    u: "1f1f9-1f1ec"
  },
  {
    n: [
      "thailand flag",
      "flag-th"
    ],
    u: "1f1f9-1f1ed"
  },
  {
    n: [
      "tajikistan flag",
      "flag-tj"
    ],
    u: "1f1f9-1f1ef"
  },
  {
    n: [
      "tokelau flag",
      "flag-tk"
    ],
    u: "1f1f9-1f1f0"
  },
  {
    n: [
      "timor-leste flag",
      "flag-tl"
    ],
    u: "1f1f9-1f1f1"
  },
  {
    n: [
      "turkmenistan flag",
      "flag-tm"
    ],
    u: "1f1f9-1f1f2"
  },
  {
    n: [
      "tunisia flag",
      "flag-tn"
    ],
    u: "1f1f9-1f1f3"
  },
  {
    n: [
      "tonga flag",
      "flag-to"
    ],
    u: "1f1f9-1f1f4"
  },
  {
    n: [
      "turkey flag",
      "flag-tr"
    ],
    u: "1f1f9-1f1f7"
  },
  {
    n: [
      "trinidad & tobago flag",
      "flag-tt"
    ],
    u: "1f1f9-1f1f9"
  },
  {
    n: [
      "tuvalu flag",
      "flag-tv"
    ],
    u: "1f1f9-1f1fb"
  },
  {
    n: [
      "taiwan flag",
      "flag-tw"
    ],
    u: "1f1f9-1f1fc"
  },
  {
    n: [
      "tanzania flag",
      "flag-tz"
    ],
    u: "1f1f9-1f1ff"
  },
  {
    n: [
      "ukraine flag",
      "flag-ua"
    ],
    u: "1f1fa-1f1e6"
  },
  {
    n: [
      "uganda flag",
      "flag-ug"
    ],
    u: "1f1fa-1f1ec"
  },
  {
    n: [
      "u.s. outlying islands flag",
      "flag-um"
    ],
    u: "1f1fa-1f1f2"
  },
  {
    n: [
      "united nations flag",
      "flag-un"
    ],
    u: "1f1fa-1f1f3"
  },
  {
    n: [
      "united states flag",
      "us",
      "flag-us"
    ],
    u: "1f1fa-1f1f8"
  },
  {
    n: [
      "uruguay flag",
      "flag-uy"
    ],
    u: "1f1fa-1f1fe"
  },
  {
    n: [
      "uzbekistan flag",
      "flag-uz"
    ],
    u: "1f1fa-1f1ff"
  },
  {
    n: [
      "vatican city flag",
      "flag-va"
    ],
    u: "1f1fb-1f1e6"
  },
  {
    n: [
      "st. vincent & grenadines flag",
      "flag-vc"
    ],
    u: "1f1fb-1f1e8"
  },
  {
    n: [
      "venezuela flag",
      "flag-ve"
    ],
    u: "1f1fb-1f1ea"
  },
  {
    n: [
      "british virgin islands flag",
      "flag-vg"
    ],
    u: "1f1fb-1f1ec"
  },
  {
    n: [
      "u.s. virgin islands flag",
      "flag-vi"
    ],
    u: "1f1fb-1f1ee"
  },
  {
    n: [
      "vietnam flag",
      "flag-vn"
    ],
    u: "1f1fb-1f1f3"
  },
  {
    n: [
      "vanuatu flag",
      "flag-vu"
    ],
    u: "1f1fb-1f1fa"
  },
  {
    n: [
      "wallis & futuna flag",
      "flag-wf"
    ],
    u: "1f1fc-1f1eb"
  },
  {
    n: [
      "samoa flag",
      "flag-ws"
    ],
    u: "1f1fc-1f1f8"
  },
  {
    n: [
      "kosovo flag",
      "flag-xk"
    ],
    u: "1f1fd-1f1f0"
  },
  {
    n: [
      "yemen flag",
      "flag-ye"
    ],
    u: "1f1fe-1f1ea"
  },
  {
    n: [
      "mayotte flag",
      "flag-yt"
    ],
    u: "1f1fe-1f1f9"
  },
  {
    n: [
      "south africa flag",
      "flag-za"
    ],
    u: "1f1ff-1f1e6"
  },
  {
    n: [
      "zambia flag",
      "flag-zm"
    ],
    u: "1f1ff-1f1f2"
  },
  {
    n: [
      "zimbabwe flag",
      "flag-zw"
    ],
    u: "1f1ff-1f1fc"
  },
  {
    n: [
      "england flag",
      "flag-england"
    ],
    u: "1f3f4-e0067-e0062-e0065-e006e-e0067-e007f"
  },
  {
    n: [
      "scotland flag",
      "flag-scotland"
    ],
    u: "1f3f4-e0067-e0062-e0073-e0063-e0074-e007f"
  },
  {
    n: [
      "wales flag",
      "flag-wales"
    ],
    u: "1f3f4-e0067-e0062-e0077-e006c-e0073-e007f"
  }
];
var emojis = {
  smileys_people: smileys_people$1,
  animals_nature: animals_nature$1,
  food_drink: food_drink$1,
  activities: activities$1,
  travel_places: travel_places$1,
  objects: objects$1,
  symbols: symbols$1,
  flags: flags$1
};
var _groups = [
  {
    key: "recent",
    title: "Recently Used",
    u: "1f551"
  },
  {
    key: "smileys_people",
    title: "Smiles & People",
    u: "1f600"
  },
  {
    key: "animals_nature",
    title: "Animals & Nature",
    u: "1F431"
  },
  {
    key: "food_drink",
    title: "Food & Drink",
    u: "2615"
  },
  {
    key: "activities",
    title: "Activities",
    u: "26BD"
  },
  {
    key: "travel_places",
    title: "Travel & Places",
    u: "1F697"
  },
  {
    key: "objects",
    title: "Objects",
    u: "1F4A1"
  },
  {
    key: "symbols",
    title: "Symbols",
    u: "1f4af"
  },
  {
    key: "flags",
    title: "Flags",
    u: "1f3f3-fe0f"
  }
];
const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
let idbProxyableTypes;
let cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const cursorRequestMap = /* @__PURE__ */ new WeakMap();
const transactionDoneMap = /* @__PURE__ */ new WeakMap();
const transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
const transformCache = /* @__PURE__ */ new WeakMap();
const reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
const writeMethods = ["put", "add", "delete", "clear"];
const cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
const DB_KEY = "EMJ";
const STORE_KEY = "emojis";
const DB_VERSION = 3;
async function initialize() {
  const db = await openDB(DB_KEY, DB_VERSION, {
    upgrade(db2, oldVersion) {
      if (!db2.objectStoreNames.contains(STORE_KEY)) {
        const store = db2.createObjectStore(STORE_KEY, {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("id", "id", {
          unique: true
        });
      }
    }
  });
  db.close();
}
initialize();
const defaultOptions = {
  native: false,
  hideSearch: true,
  hideGroupIcons: false,
  hideGroupNames: false,
  staticTexts: {},
  disabledGroups: [],
  groupNames: {},
  displayRecent: false,
  additionalGroups: {},
  groupOrder: [],
  groupIcons: {}
};
async function getRecentEmojis() {
  const db = await openDB(DB_KEY, DB_VERSION);
  const store = db.transaction(STORE_KEY, "readonly").objectStore(STORE_KEY);
  return await store.getAll();
}
function Store() {
  const state = reactive({
    search: "",
    emoji: DEFAULT_EMOJI,
    activeGroup: "",
    skinTone: SKIN_TONE_NEUTRAL,
    options: defaultOptions,
    additionalGroups: {},
    recent: [],
    get emojis() {
      return {
        recent: this.recent,
        ...this.options.additionalGroups,
        ...emojis
      };
    },
    get disabled() {
      let disabled = Array.isArray(this.options.disabledGroups) ? this.options.disabledGroups : [];
      if (!this.options.displayRecent) {
        disabled = ["recent", ...disabled];
      }
      return disabled;
    },
    get groups() {
      return _groups.filter(
        (group) => !this.disabled.includes(group.key)
      );
    },
    get orderedGroupKeys() {
      const keys = [
        ...this.options.groupOrder,
        ...Object.keys(this.options.additionalGroups),
        ..._groups.map((group) => group.key)
      ];
      return [...new Set(keys)].filter((key) => !this.disabled.includes(key));
    }
  });
  function initialize2() {
    if (state.options.displayRecent) {
      setInitialRecentEmojis();
    }
  }
  async function getRecent() {
    var _a;
    let recent2 = await getRecentEmojis();
    if (Array.isArray(recent2) && recent2.length) {
      recent2 = JSON.parse(((_a = recent2[0]) == null ? void 0 : _a.value) || "");
    } else {
      recent2 = [];
    }
    return recent2;
  }
  function setInitialRecentEmojis() {
    getRecent().then((recent2) => {
      state.recent = recent2;
      updateLocalStore();
    });
  }
  const updateSearch = (value) => {
    state.search = value;
  };
  const updateEmoji = (value) => {
    state.emoji = value;
  };
  const updateActiveGroup = (group) => {
    state.activeGroup = group;
  };
  const updateSkinTone = (tone = SKIN_TONE_NEUTRAL) => {
    state.skinTone = tone;
  };
  const updateOptions = (options) => {
    state.options = Object.assign({}, state.options, options);
    initialize2();
  };
  async function updateLocalStore() {
    const db = await openDB(DB_KEY, DB_VERSION);
    const store = db.transaction(STORE_KEY, "readwrite").objectStore(STORE_KEY);
    store.put({
      id: 0,
      value: JSON.stringify(state.recent)
    });
    return;
  }
  const updateSelect = (emoji) => {
    if (state.options.displayRecent !== true)
      return;
    const index2 = state.recent.findIndex((item) => item.u === emoji.u);
    if (index2 > 0)
      state.recent.splice(index2, 1);
    if (index2 === 0)
      return;
    const _emoji = { u: emoji.u, n: toRaw(emoji.n) };
    state.recent = [_emoji, ...state.recent];
    if (state.recent.length > 24)
      state.recent.length = 24;
    updateLocalStore();
  };
  return {
    state: readonly(state),
    updateSearch,
    updateEmoji,
    updateActiveGroup,
    updateSkinTone,
    updateOptions,
    updateSelect
  };
}
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth;
    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }
  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === "function" ? roundOffsets(offsets) : offsets, _ref3$x = _ref3.x, x = _ref3$x === void 0 ? 0 : _ref3$x, _ref3$y = _ref3.y, y = _ref3$y === void 0 ? 0 : _ref3$y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref4) {
  var state = _ref4.state, options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body" && (canEscapeClipping ? getComputedStyle(clippingParent).position !== "static" : true);
  });
}
function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = offset2 + overflow[mainSide];
    var max$1 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions2;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions2, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index2 = 0; index2 < state.orderedModifiers.length; index2++) {
          if (state.reset === true) {
            state.reset = false;
            index2 = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index2], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
var smileys_people = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSAxNiA0IEMgOS4zODI4MTMgNCA0IDkuMzgyODEzIDQgMTYgQyA0IDIyLjYxNzE4OCA5LjM4MjgxMyAyOCAxNiAyOCBDIDIyLjYxNzE4OCAyOCAyOCAyMi42MTcxODggMjggMTYgQyAyOCA5LjM4MjgxMyAyMi42MTcxODggNCAxNiA0IFogTSAxNiA2IEMgMjEuNTM1MTU2IDYgMjYgMTAuNDY0ODQ0IDI2IDE2IEMgMjYgMjEuNTM1MTU2IDIxLjUzNTE1NiAyNiAxNiAyNiBDIDEwLjQ2NDg0NCAyNiA2IDIxLjUzNTE1NiA2IDE2IEMgNiAxMC40NjQ4NDQgMTAuNDY0ODQ0IDYgMTYgNiBaIE0gMTEuNSAxMiBDIDEwLjY3MTg3NSAxMiAxMCAxMi42NzE4NzUgMTAgMTMuNSBDIDEwIDE0LjMyODEyNSAxMC42NzE4NzUgMTUgMTEuNSAxNSBDIDEyLjMyODEyNSAxNSAxMyAxNC4zMjgxMjUgMTMgMTMuNSBDIDEzIDEyLjY3MTg3NSAxMi4zMjgxMjUgMTIgMTEuNSAxMiBaIE0gMjAuNSAxMiBDIDE5LjY3MTg3NSAxMiAxOSAxMi42NzE4NzUgMTkgMTMuNSBDIDE5IDE0LjMyODEyNSAxOS42NzE4NzUgMTUgMjAuNSAxNSBDIDIxLjMyODEyNSAxNSAyMiAxNC4zMjgxMjUgMjIgMTMuNSBDIDIyIDEyLjY3MTg3NSAyMS4zMjgxMjUgMTIgMjAuNSAxMiBaIE0gMTAuODEyNSAxOSBMIDkuMDkzNzUgMjAgQyAxMC40NzY1NjMgMjIuMzg2NzE5IDEzLjA0Njg3NSAyNCAxNiAyNCBDIDE4Ljk1MzEyNSAyNCAyMS41MjM0MzggMjIuMzg2NzE5IDIyLjkwNjI1IDIwIEwgMjEuMTg3NSAxOSBDIDIwLjE0ODQzOCAyMC43OTI5NjkgMTguMjI2NTYzIDIyIDE2IDIyIEMgMTMuNzczNDM4IDIyIDExLjg1MTU2MyAyMC43OTI5NjkgMTAuODEyNSAxOSBaIi8+PC9zdmc+";
function unicodeToEmoji(unicode) {
  return unicode.split("-").map((hex) => parseInt(hex, 16)).map((hex) => String.fromCodePoint(hex)).join("");
}
function filterEmojis(emojis2, keyword, skinTone, disabledGroups = []) {
  const _emojiData = {};
  Object.keys(emojis2).forEach((key) => {
    if (disabledGroups.includes(key)) {
      return;
    }
    const _emojis = [];
    emojis2[key].forEach((emoji) => {
      var _a;
      if (emoji[EMOJI_NAME_KEY][0].includes(keyword.toLocaleLowerCase())) {
        let result = emoji[EMOJI_UNICODE_KEY];
        if (skinTone !== SKIN_TONE_NEUTRAL && Array.isArray(emoji[EMOJI_VARIATIONS_KEY])) {
          const v_index = ((_a = emoji[EMOJI_VARIATIONS_KEY]) == null ? void 0 : _a.findIndex(
            (v) => v.includes(skinTone)
          )) || -1;
          if (v_index !== -1 && emoji[EMOJI_VARIATIONS_KEY]) {
            result = emoji[EMOJI_VARIATIONS_KEY][v_index];
          }
        }
        return _emojis.push({
          ...emoji,
          [EMOJI_RESULT_KEY]: result
        });
      }
    });
    if (_emojis.length) {
      _emojiData[key] = _emojis;
    }
  });
  return _emojiData;
}
function isMac() {
  var _a;
  let platform = ((_a = navigator == null ? void 0 : navigator.userAgentData) == null ? void 0 : _a.platform) || (navigator == null ? void 0 : navigator.platform) || "unknown";
  return platform.toUpperCase().indexOf("MAC") !== -1;
}
function snakeToCapitalizedCase(string) {
  return string.replace(
    /^_*(.)|_+(.)/g,
    (s, c, d) => c ? c.toUpperCase() : " " + d.toUpperCase()
  );
}
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$4 = defineComponent({
  name: "Body",
  emits: {
    select: (emoji) => true
  },
  setup() {
    const { state, updateEmoji, updateSelect } = inject("store");
    const bodyInner = ref(null);
    const emojis2 = computed(() => {
      return filterEmojis(
        state.emojis,
        state.search,
        state.skinTone,
        state.options.disabledGroups
      );
    });
    const _this = getCurrentInstance();
    const hasGroupNames = computed(() => !state.options.hideGroupNames);
    const isSticky = computed(() => !state.options.disableStickyGroupNames);
    const groupNames = toRaw(state.options.groupNames);
    const orderedKeys = state.orderedGroupKeys;
    if (state.options.additionalGroups) {
      Object.keys(state.options.additionalGroups).map((k) => {
        if (state.options.groupNames[k]) {
          groupNames[k] = state.options.groupNames[k];
        } else {
          groupNames[k] = snakeToCapitalizedCase(k);
        }
      });
    }
    const platform = isMac() ? "is-mac" : "";
    function handleMouseEnter(emoji) {
      updateEmoji(emoji);
    }
    function handleClick(emoji) {
      updateSelect(emoji);
      _this == null ? void 0 : _this.emit("select", {
        ...emoji,
        t: state.skinTone,
        i: unicodeToEmoji(emoji.r)
      });
    }
    function handleError(event, unicode) {
      var _a;
      const button = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.closest("button");
      if (button) {
        button.innerHTML = `<span>${unicodeToEmoji(unicode)}</span>`;
      }
    }
    watch(
      () => state.activeGroup,
      () => {
        var _a;
        const target = (_a = bodyInner.value) == null ? void 0 : _a.querySelector("#" + state.activeGroup);
        if (target) {
          target.parentNode.scrollTop = target.offsetTop - target.parentNode.offsetTop;
        }
      }
    );
    return {
      emojis: emojis2,
      bodyInner,
      EMOJI_REMOTE_SRC,
      GROUP_NAMES,
      handleClick,
      handleError,
      handleMouseEnter,
      native: state.options.native,
      unicodeToEmoji,
      EMOJI_RESULT_KEY,
      EMOJI_NAME_KEY,
      hasGroupNames,
      isSticky,
      platform,
      groupNames,
      orderedKeys
    };
  }
});
const _hoisted_1$3 = { class: "v3-body" };
const _hoisted_2$3 = ["id"];
const _hoisted_3$3 = { class: "v3-emojis" };
const _hoisted_4$3 = ["onMouseenter", "onClick"];
const _hoisted_5$3 = { key: 0 };
const _hoisted_6$2 = ["src", "alt", "onError"];
const _hoisted_7$1 = {
  key: 1,
  class: "v3-no-result"
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createElementVNode("div", {
      ref: "bodyInner",
      class: normalizeClass([_ctx.platform, "v3-body-inner"])
    }, [
      _ctx.orderedKeys.length ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(_ctx.orderedKeys, (key) => {
        return openBlock(), createElementBlock("div", {
          id: key,
          key,
          class: "v3-group"
        }, [
          _ctx.hasGroupNames ? withDirectives((openBlock(), createElementBlock("h5", {
            key: 0,
            class: normalizeClass(_ctx.isSticky ? `v3-sticky` : ``)
          }, toDisplayString(_ctx.groupNames[key]), 3)), [
            [vShow, _ctx.emojis[key]]
          ]) : createCommentVNode("", true),
          withDirectives(createElementVNode("div", _hoisted_3$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.emojis[key], (emoji) => {
              return openBlock(), createElementBlock("button", {
                key: emoji.r,
                type: "button",
                onMouseenter: ($event) => _ctx.handleMouseEnter(emoji),
                onClick: ($event) => _ctx.handleClick(emoji)
              }, [
                _ctx.native ? (openBlock(), createElementBlock("span", _hoisted_5$3, toDisplayString(_ctx.unicodeToEmoji(emoji.r)), 1)) : (openBlock(), createElementBlock("img", {
                  key: 1,
                  src: _ctx.EMOJI_REMOTE_SRC + `/${emoji.r}.png`,
                  alt: emoji.n[0],
                  onError: ($event) => _ctx.handleError($event, emoji.r)
                }, null, 40, _hoisted_6$2))
              ], 40, _hoisted_4$3);
            }), 128))
          ], 512), [
            [vShow, _ctx.emojis[key]]
          ])
        ], 8, _hoisted_2$3);
      }), 128)) : (openBlock(), createElementBlock("span", _hoisted_7$1, " No emoji has been found! "))
    ], 2)
  ]);
}
var Body = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
var animals_nature = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSAxMi41IDUgQyAxMS40Mjk2ODggNSAxMC41IDUuNjA5Mzc1IDkuOTA2MjUgNi40Mzc1IEMgOS4zMTI1IDcuMjY1NjI1IDkgOC4zMzk4NDQgOSA5LjUgQyA5IDEwLjY2MDE1NiA5LjMxMjUgMTEuNzM0Mzc1IDkuOTA2MjUgMTIuNTYyNSBDIDEwLjUgMTMuMzkwNjI1IDExLjQyOTY4OCAxNCAxMi41IDE0IEMgMTMuNTcwMzEzIDE0IDE0LjUgMTMuMzkwNjI1IDE1LjA5Mzc1IDEyLjU2MjUgQyAxNS42ODc1IDExLjczNDM3NSAxNiAxMC42NjAxNTYgMTYgOS41IEMgMTYgOC4zMzk4NDQgMTUuNjg3NSA3LjI2NTYyNSAxNS4wOTM3NSA2LjQzNzUgQyAxNC41IDUuNjA5Mzc1IDEzLjU3MDMxMyA1IDEyLjUgNSBaIE0gMTYgOS41IEMgMTYgMTAuNjYwMTU2IDE2LjMxMjUgMTEuNzM0Mzc1IDE2LjkwNjI1IDEyLjU2MjUgQyAxNy41IDEzLjM5MDYyNSAxOC40Mjk2ODggMTQgMTkuNSAxNCBDIDIwLjU3MDMxMyAxNCAyMS41IDEzLjM5MDYyNSAyMi4wOTM3NSAxMi41NjI1IEMgMjIuNjg3NSAxMS43MzQzNzUgMjMgMTAuNjYwMTU2IDIzIDkuNSBDIDIzIDguMzM5ODQ0IDIyLjY4NzUgNy4yNjU2MjUgMjIuMDkzNzUgNi40Mzc1IEMgMjEuNSA1LjYwOTM3NSAyMC41NzAzMTMgNSAxOS41IDUgQyAxOC40Mjk2ODggNSAxNy41IDUuNjA5Mzc1IDE2LjkwNjI1IDYuNDM3NSBDIDE2LjMxMjUgNy4yNjU2MjUgMTYgOC4zMzk4NDQgMTYgOS41IFogTSAxMi41IDcgQyAxMi44MTI1IDcgMTMuMTU2MjUgNy4xNTYyNSAxMy40Njg3NSA3LjU5Mzc1IEMgMTMuNzgxMjUgOC4wMzEyNSAxNCA4LjcyNjU2MyAxNCA5LjUgQyAxNCAxMC4yNzM0MzggMTMuNzgxMjUgMTAuOTY4NzUgMTMuNDY4NzUgMTEuNDA2MjUgQyAxMy4xNTYyNSAxMS44NDM3NSAxMi44MTI1IDEyIDEyLjUgMTIgQyAxMi4xODc1IDEyIDExLjg0Mzc1IDExLjg0Mzc1IDExLjUzMTI1IDExLjQwNjI1IEMgMTEuMjE4NzUgMTAuOTY4NzUgMTEgMTAuMjczNDM4IDExIDkuNSBDIDExIDguNzI2NTYzIDExLjIxODc1IDguMDMxMjUgMTEuNTMxMjUgNy41OTM3NSBDIDExLjg0Mzc1IDcuMTU2MjUgMTIuMTg3NSA3IDEyLjUgNyBaIE0gMTkuNSA3IEMgMTkuODEyNSA3IDIwLjE1NjI1IDcuMTU2MjUgMjAuNDY4NzUgNy41OTM3NSBDIDIwLjc4MTI1IDguMDMxMjUgMjEgOC43MjY1NjMgMjEgOS41IEMgMjEgMTAuMjczNDM4IDIwLjc4MTI1IDEwLjk2ODc1IDIwLjQ2ODc1IDExLjQwNjI1IEMgMjAuMTU2MjUgMTEuODQzNzUgMTkuODEyNSAxMiAxOS41IDEyIEMgMTkuMTg3NSAxMiAxOC44NDM3NSAxMS44NDM3NSAxOC41MzEyNSAxMS40MDYyNSBDIDE4LjIxODc1IDEwLjk2ODc1IDE4IDEwLjI3MzQzOCAxOCA5LjUgQyAxOCA4LjcyNjU2MyAxOC4yMTg3NSA4LjAzMTI1IDE4LjUzMTI1IDcuNTkzNzUgQyAxOC44NDM3NSA3LjE1NjI1IDE5LjE4NzUgNyAxOS41IDcgWiBNIDcuNSAxMiBDIDYuNDI5Njg4IDEyIDUuNSAxMi42MDkzNzUgNC45MDYyNSAxMy40Mzc1IEMgNC4zMTI1IDE0LjI2NTYyNSA0IDE1LjMzOTg0NCA0IDE2LjUgQyA0IDE3LjY2MDE1NiA0LjMxMjUgMTguNzM0Mzc1IDQuOTA2MjUgMTkuNTYyNSBDIDUuNSAyMC4zOTA2MjUgNi40Mjk2ODggMjEgNy41IDIxIEMgOC41NzAzMTMgMjEgOS41IDIwLjM5MDYyNSAxMC4wOTM3NSAxOS41NjI1IEMgMTAuNjg3NSAxOC43MzQzNzUgMTEgMTcuNjYwMTU2IDExIDE2LjUgQyAxMSAxNS4zMzk4NDQgMTAuNjg3NSAxNC4yNjU2MjUgMTAuMDkzNzUgMTMuNDM3NSBDIDkuNSAxMi42MDkzNzUgOC41NzAzMTMgMTIgNy41IDEyIFogTSAyNC41IDEyIEMgMjMuNDI5Njg4IDEyIDIyLjUgMTIuNjA5Mzc1IDIxLjkwNjI1IDEzLjQzNzUgQyAyMS4zMTI1IDE0LjI2NTYyNSAyMSAxNS4zMzk4NDQgMjEgMTYuNSBDIDIxIDE3LjY2MDE1NiAyMS4zMTI1IDE4LjczNDM3NSAyMS45MDYyNSAxOS41NjI1IEMgMjIuNSAyMC4zOTA2MjUgMjMuNDI5Njg4IDIxIDI0LjUgMjEgQyAyNS41NzAzMTMgMjEgMjYuNSAyMC4zOTA2MjUgMjcuMDkzNzUgMTkuNTYyNSBDIDI3LjY4NzUgMTguNzM0Mzc1IDI4IDE3LjY2MDE1NiAyOCAxNi41IEMgMjggMTUuMzM5ODQ0IDI3LjY4NzUgMTQuMjY1NjI1IDI3LjA5Mzc1IDEzLjQzNzUgQyAyNi41IDEyLjYwOTM3NSAyNS41NzAzMTMgMTIgMjQuNSAxMiBaIE0gNy41IDE0IEMgNy44MTI1IDE0IDguMTU2MjUgMTQuMTU2MjUgOC40Njg3NSAxNC41OTM3NSBDIDguNzgxMjUgMTUuMDMxMjUgOSAxNS43MjY1NjMgOSAxNi41IEMgOSAxNy4yNzM0MzggOC43ODEyNSAxNy45Njg3NSA4LjQ2ODc1IDE4LjQwNjI1IEMgOC4xNTYyNSAxOC44NDM3NSA3LjgxMjUgMTkgNy41IDE5IEMgNy4xODc1IDE5IDYuODQzNzUgMTguODQzNzUgNi41MzEyNSAxOC40MDYyNSBDIDYuMjE4NzUgMTcuOTY4NzUgNiAxNy4yNzM0MzggNiAxNi41IEMgNiAxNS43MjY1NjMgNi4yMTg3NSAxNS4wMzEyNSA2LjUzMTI1IDE0LjU5Mzc1IEMgNi44NDM3NSAxNC4xNTYyNSA3LjE4NzUgMTQgNy41IDE0IFogTSAyNC41IDE0IEMgMjQuODEyNSAxNCAyNS4xNTYyNSAxNC4xNTYyNSAyNS40Njg3NSAxNC41OTM3NSBDIDI1Ljc4MTI1IDE1LjAzMTI1IDI2IDE1LjcyNjU2MyAyNiAxNi41IEMgMjYgMTcuMjczNDM4IDI1Ljc4MTI1IDE3Ljk2ODc1IDI1LjQ2ODc1IDE4LjQwNjI1IEMgMjUuMTU2MjUgMTguODQzNzUgMjQuODEyNSAxOSAyNC41IDE5IEMgMjQuMTg3NSAxOSAyMy44NDM3NSAxOC44NDM3NSAyMy41MzEyNSAxOC40MDYyNSBDIDIzLjIxODc1IDE3Ljk2ODc1IDIzIDE3LjI3MzQzOCAyMyAxNi41IEMgMjMgMTUuNzI2NTYzIDIzLjIxODc1IDE1LjAzMTI1IDIzLjUzMTI1IDE0LjU5Mzc1IEMgMjMuODQzNzUgMTQuMTU2MjUgMjQuMTg3NSAxNCAyNC41IDE0IFogTSAxNiAxNiBDIDE0LjY2Nzk2OSAxNiAxMy43MzgyODEgMTYuODY3MTg4IDEzLjI4MTI1IDE3LjYyNSBDIDEyLjgyNDIxOSAxOC4zODI4MTMgMTIuNTQ2ODc1IDE5LjAxNTYyNSAxMi4yODEyNSAxOS4yODEyNSBDIDEyLjEyNSAxOS40Mzc1IDExLjE2MDE1NiAxOS44MDA3ODEgMTAuMTU2MjUgMjAuMzEyNSBDIDkuNjUyMzQ0IDIwLjU3MDMxMyA5LjE0NDUzMSAyMC45MTQwNjMgOC43MTg3NSAyMS40Mzc1IEMgOC4yOTI5NjkgMjEuOTYwOTM4IDggMjIuNjg3NSA4IDIzLjUgQyA4IDI1LjQyMTg3NSA5LjU3ODEyNSAyNyAxMS41IDI3IEMgMTIuMzY3MTg4IDI3IDEzLjI2OTUzMSAyNi43MjI2NTYgMTQuMTU2MjUgMjYuNDY4NzUgQyAxNS4wNDI5NjkgMjYuMjE0ODQ0IDE2IDI2IDE2IDI2IEMgMTYgMjYgMTYuOTU3MDMxIDI2LjIxNDg0NCAxNy44NDM3NSAyNi40Njg3NSBDIDE4LjczMDQ2OSAyNi43MjI2NTYgMTkuNjMyODEzIDI3IDIwLjUgMjcgQyAyMi40MjE4NzUgMjcgMjQgMjUuNDIxODc1IDI0IDIzLjUgQyAyNCAyMi43MDcwMzEgMjMuNzA3MDMxIDIxLjk4MDQ2OSAyMy4yODEyNSAyMS40Njg3NSBDIDIyLjg1NTQ2OSAyMC45NTcwMzEgMjIuMzQzNzUgMjAuNjQwNjI1IDIxLjg0Mzc1IDIwLjM3NSBDIDIwLjg0Mzc1IDE5Ljg0Mzc1IDE5Ljg1OTM3NSAxOS40MjE4NzUgMTkuNzE4NzUgMTkuMjgxMjUgQyAxOS40ODA0NjkgMTkuMDQyOTY5IDE5LjIxMDkzOCAxOC4zOTA2MjUgMTguNzUgMTcuNjI1IEMgMTguMjg5MDYzIDE2Ljg1OTM3NSAxNy4zMzk4NDQgMTYgMTYgMTYgWiBNIDE2IDE4IEMgMTYuNjYwMTU2IDE4IDE2LjczNDM3NSAxOC4xNjAxNTYgMTcuMDMxMjUgMTguNjU2MjUgQyAxNy4zMjgxMjUgMTkuMTUyMzQ0IDE3LjU1NDY4OCAxOS45OTIxODggMTguMjgxMjUgMjAuNzE4NzUgQyAxOS4xMDU0NjkgMjEuNTQyOTY5IDIwLjE0ODQzOCAyMS43MjI2NTYgMjAuOTA2MjUgMjIuMTI1IEMgMjEuMjg1MTU2IDIyLjMyODEyNSAyMS41NzgxMjUgMjIuNTQyOTY5IDIxLjc1IDIyLjc1IEMgMjEuOTIxODc1IDIyLjk1NzAzMSAyMiAyMy4xNDg0MzggMjIgMjMuNSBDIDIyIDI0LjMzOTg0NCAyMS4zMzk4NDQgMjUgMjAuNSAyNSBDIDIwLjIxMDkzOCAyNSAxOS4yNzczNDQgMjQuNzc3MzQ0IDE4LjQwNjI1IDI0LjUzMTI1IEMgMTcuNTM1MTU2IDI0LjI4NTE1NiAxNi44MTY0MDYgMjQgMTYgMjQgQyAxNS4xODM1OTQgMjQgMTQuNDY0ODQ0IDI0LjI4NTE1NiAxMy41OTM3NSAyNC41MzEyNSBDIDEyLjcyMjY1NiAyNC43NzczNDQgMTEuNzg5MDYzIDI1IDExLjUgMjUgQyAxMC42NjAxNTYgMjUgMTAgMjQuMzM5ODQ0IDEwIDIzLjUgQyAxMCAyMy4wOTc2NTYgMTAuMDgyMDMxIDIyLjg5MDYyNSAxMC4yNSAyMi42ODc1IEMgMTAuNDE3OTY5IDIyLjQ4NDM3NSAxMC43MjI2NTYgMjIuMjg1MTU2IDExLjA5Mzc1IDIyLjA5Mzc1IEMgMTEuODM5ODQ0IDIxLjcxNDg0NCAxMi44NzUgMjEuNTYyNSAxMy43MTg3NSAyMC43MTg3NSBDIDE0LjQ1MzEyNSAxOS45ODQzNzUgMTQuNjc1NzgxIDE5LjExNzE4OCAxNC45Njg3NSAxOC42MjUgQyAxNS4yNjE3MTkgMTguMTMyODEzIDE1LjMzMjAzMSAxOCAxNiAxOCBaIi8+PC9zdmc+";
var food_drink = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSAxMSAzIEwgMTEgNyBMIDEzIDcgTCAxMyAzIFogTSAxNSA0IEwgMTUgNyBMIDE3IDcgTCAxNyA0IFogTSA0Ljg3NSA4IEwgNSA5LjA5Mzc1IEwgNi44MTI1IDI2LjMxMjUgQyA2Ljk3MjY1NiAyNy44MzIwMzEgOC4yODUxNTYgMjkgOS44MTI1IDI5IEwgMTkuMTg3NSAyOSBDIDIwLjcxNDg0NCAyOSAyMi4wMjczNDQgMjcuODMyMDMxIDIyLjE4NzUgMjYuMzEyNSBMIDIyLjY1NjI1IDIyIEwgMjUgMjIgQyAyNi42NDQ1MzEgMjIgMjggMjAuNjQ0NTMxIDI4IDE5IEwgMjggMTYgQyAyOCAxNC4zNTU0NjkgMjYuNjQ0NTMxIDEzIDI1IDEzIEwgMjMuNTkzNzUgMTMgTCAyNCA5LjA5Mzc1IEwgMjQuMTI1IDggWiBNIDcuMTI1IDEwIEwgMjEuODc1IDEwIEwgMjAuMTg3NSAyNi4wOTM3NSBDIDIwLjEzMjgxMyAyNi42MTMyODEgMTkuNzA3MDMxIDI3IDE5LjE4NzUgMjcgTCA5LjgxMjUgMjcgQyA5LjI5Mjk2OSAyNyA4Ljg2NzE4OCAyNi42MTMyODEgOC44MTI1IDI2LjA5Mzc1IFogTSAyMy4zNzUgMTUgTCAyNSAxNSBDIDI1LjU2NjQwNiAxNSAyNiAxNS40MzM1OTQgMjYgMTYgTCAyNiAxOSBDIDI2IDE5LjU2NjQwNiAyNS41NjY0MDYgMjAgMjUgMjAgTCAyMi44NDM3NSAyMCBaIi8+PC9zdmc+";
var activities = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSAxNiAzIEMgOC44MzIwMzEgMyAzIDguODMyMDMxIDMgMTYgQyAzIDIzLjE2Nzk2OSA4LjgzMjAzMSAyOSAxNiAyOSBDIDIzLjE2Nzk2OSAyOSAyOSAyMy4xNjc5NjkgMjkgMTYgQyAyOSA4LjgzMjAzMSAyMy4xNjc5NjkgMyAxNiAzIFogTSAxNiA1IEMgMTYuNjAxNTYzIDUgMTcuMTc1NzgxIDUuMDYyNSAxNy43NSA1LjE1NjI1IEwgMTYgNi40MDYyNSBMIDE0LjI1IDUuMTU2MjUgQyAxNC44MjAzMTMgNS4wNjY0MDYgMTUuNDAyMzQ0IDUgMTYgNSBaIE0gMTEuODEyNSA1Ljg0Mzc1IEwgMTUuNDA2MjUgOC40Njg3NSBMIDE2IDguOTA2MjUgTCAxNi41OTM3NSA4LjQ2ODc1IEwgMjAuMTg3NSA1Ljg0Mzc1IEMgMjEuNzg1MTU2IDYuNTA3ODEzIDIzLjE5NTMxMyA3LjUyMzQzOCAyNC4zMTI1IDguODEyNSBMIDIyLjkzNzUgMTMuMDkzNzUgTCAyMi43MTg3NSAxMy43ODEyNSBMIDIzLjMxMjUgMTQuMTg3NSBMIDI2LjkzNzUgMTYuODQzNzUgQyAyNi44MDQ2ODggMTguNjA1NDY5IDI2LjI2NTYyNSAyMC4yNTc4MTMgMjUuNDA2MjUgMjEuNjg3NSBMIDIwLjEyNSAyMS42ODc1IEwgMTkuOTA2MjUgMjIuMzc1IEwgMTguNSAyNi43MTg3NSBDIDE3LjY5OTIxOSAyNi45MDYyNSAxNi44NTkzNzUgMjcgMTYgMjcgQyAxNS4xMDU0NjkgMjcgMTQuMjM4MjgxIDI2Ljg4NjcxOSAxMy40MDYyNSAyNi42ODc1IEwgMTIuMDMxMjUgMjIuNDA2MjUgTCAxMS44MTI1IDIxLjcxODc1IEwgNi41OTM3NSAyMS43MTg3NSBDIDUuNzE4NzUgMjAuMjgxMjUgNS4xOTkyMTkgMTguNjIxMDk0IDUuMDYyNSAxNi44NDM3NSBMIDguNjU2MjUgMTQuMjE4NzUgTCA5LjI1IDEzLjgxMjUgTCA5LjAzMTI1IDEzLjEyNSBMIDcuNjI1IDguODc1IEMgOC43NSA3LjU1NDY4OCAxMC4xODM1OTQgNi41MTU2MjUgMTEuODEyNSA1Ljg0Mzc1IFogTSAxNiAxMC4wOTM3NSBMIDE1LjQwNjI1IDEwLjUzMTI1IEwgMTAuODQzNzUgMTMuODQzNzUgTCAxMC4yODEyNSAxNC4yODEyNSBMIDEwLjUgMTQuOTY4NzUgTCAxMi4yNSAyMC4zMTI1IEwgMTIuNDY4NzUgMjEgTCAxOS41MzEyNSAyMSBMIDE5Ljc1IDIwLjMxMjUgTCAyMS41IDE0Ljk2ODc1IEwgMjEuNzE4NzUgMTQuMjgxMjUgTCAyMS4xNTYyNSAxMy44NDM3NSBMIDE2LjU5Mzc1IDEwLjUzMTI1IFogTSAyNS43NSAxMC45MDYyNSBDIDI2LjI5Njg3NSAxMS45NTMxMjUgMjYuNjU2MjUgMTMuMTAxNTYzIDI2Ljg0Mzc1IDE0LjMxMjUgTCAyNS4wNjI1IDEzLjAzMTI1IFogTSA2LjIxODc1IDEwLjk2ODc1IEwgNi45MDYyNSAxMy4wMzEyNSBMIDUuMTU2MjUgMTQuMzEyNSBDIDUuMzM5ODQ0IDEzLjEyNSA1LjY4NzUgMTIgNi4yMTg3NSAxMC45Njg3NSBaIE0gMTYgMTIuNTkzNzUgTCAxOS4zNzUgMTUuMDMxMjUgTCAxOC4wOTM3NSAxOSBMIDEzLjkwNjI1IDE5IEwgMTIuNjI1IDE1LjAzMTI1IFogTSAyMS41OTM3NSAyMy42ODc1IEwgMjMuODQzNzUgMjMuNjg3NSBDIDIyLjk5MjE4OCAyNC41NjY0MDYgMjIuMDExNzE5IDI1LjI5Mjk2OSAyMC45MDYyNSAyNS44NDM3NSBaIE0gOC4xNTYyNSAyMy43MTg3NSBMIDEwLjM0Mzc1IDIzLjcxODc1IEwgMTEuMDMxMjUgMjUuODEyNSBDIDkuOTYwOTM4IDI1LjI2OTUzMSA4Ljk4ODI4MSAyNC41NjI1IDguMTU2MjUgMjMuNzE4NzUgWiIvPjwvc3ZnPg==";
var travel_places = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSA5LjUgNiBDIDguMTc5Njg4IDYgNy4wMDM5MDYgNi44NTkzNzUgNi42MjUgOC4xMjUgTCA1LjI1IDEyLjcxODc1IEwgMy4zMTI1IDEyLjA2MjUgTCAyLjY4NzUgMTMuOTM3NSBMIDQuNjU2MjUgMTQuNTkzNzUgTCA0LjAzMTI1IDE2LjcxODc1IEMgNC4wMDc4MTMgMTYuODA4NTk0IDMuOTk2MDk0IDE2LjkwNjI1IDQgMTcgTCA0IDI0IEMgNCAyNC4wMzEyNSA0IDI0LjA2MjUgNCAyNC4wOTM3NSBMIDQgMjUgQyA0IDI1LjU1MDc4MSA0LjQ0OTIxOSAyNiA1IDI2IEwgOCAyNiBMIDguMzQzNzUgMjUgTCAyMy42NTYyNSAyNSBMIDI0IDI2IEwgMjcgMjYgQyAyNy41NTA3ODEgMjYgMjggMjUuNTUwNzgxIDI4IDI1IEwgMjggMjQuMTU2MjUgQyAyOC4wMDM5MDYgMjQuMTA1NDY5IDI4LjAwMzkwNiAyNC4wNTA3ODEgMjggMjQgTCAyOCAxNyBDIDI4LjAwMzkwNiAxNi45MDYyNSAyNy45OTIxODggMTYuODA4NTk0IDI3Ljk2ODc1IDE2LjcxODc1IEwgMjcuMzQzNzUgMTQuNTkzNzUgTCAyOS4zMTI1IDEzLjkzNzUgTCAyOC42ODc1IDEyLjA2MjUgTCAyNi43NSAxMi43MTg3NSBMIDI1LjM3NSA4LjEyNSBDIDI0Ljk5NjA5NCA2Ljg1OTM3NSAyMy44MjAzMTMgNiAyMi41IDYgWiBNIDkuNSA4IEwgMjIuNSA4IEMgMjIuOTQ1MzEzIDggMjMuMzM5ODQ0IDguMjkyOTY5IDIzLjQ2ODc1IDguNzE4NzUgTCAyNC43NSAxMyBMIDcuMjUgMTMgTCA4LjUzMTI1IDguNzE4NzUgQyA4LjY2MDE1NiA4LjI4OTA2MyA5LjA1NDY4OCA4IDkuNSA4IFogTSA2LjY1NjI1IDE1IEwgMjUuMzQzNzUgMTUgTCAyNiAxNy4xODc1IEwgMjYgMjMgTCA2IDIzIEwgNiAxNy4xODc1IFogTSA4LjUgMTYgQyA3LjY3MTg3NSAxNiA3IDE2LjY3MTg3NSA3IDE3LjUgQyA3IDE4LjMyODEyNSA3LjY3MTg3NSAxOSA4LjUgMTkgQyA5LjMyODEyNSAxOSAxMCAxOC4zMjgxMjUgMTAgMTcuNSBDIDEwIDE2LjY3MTg3NSA5LjMyODEyNSAxNiA4LjUgMTYgWiBNIDIzLjUgMTYgQyAyMi42NzE4NzUgMTYgMjIgMTYuNjcxODc1IDIyIDE3LjUgQyAyMiAxOC4zMjgxMjUgMjIuNjcxODc1IDE5IDIzLjUgMTkgQyAyNC4zMjgxMjUgMTkgMjUgMTguMzI4MTI1IDI1IDE3LjUgQyAyNSAxNi42NzE4NzUgMjQuMzI4MTI1IDE2IDIzLjUgMTYgWiBNIDEyIDE5IEwgMTAuNzUgMjIgTCAxMi45MDYyNSAyMiBMIDEzLjM0Mzc1IDIxIEwgMTguNjU2MjUgMjEgTCAxOS4wOTM3NSAyMiBMIDIxLjI1IDIyIEwgMjAgMTkgWiIvPjwvc3ZnPg==";
var objects = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSAxNiA0IEMgMTEuMDQyOTY5IDQgNyA4LjA0Mjk2OSA3IDEzIEMgNyAxNC45MTc5NjkgNy44NDM3NSAxNi45MDYyNSA5IDE4LjY4NzUgQyA5Ljg1OTM3NSAyMC4wMTE3MTkgMTAuODg2NzE5IDIxLjIzMDQ2OSAxMiAyMi4xNTYyNSBMIDEyIDI1IEMgMTIgMjYuMDkzNzUgMTIuOTA2MjUgMjcgMTQgMjcgTCAxNSAyOCBMIDE3IDI4IEwgMTggMjcgQyAxOS4wOTM3NSAyNyAyMCAyNi4wOTM3NSAyMCAyNSBMIDIwIDIyLjE1NjI1IEMgMjEuMTEzMjgxIDIxLjIzMDQ2OSAyMi4xNDA2MjUgMjAuMDExNzE5IDIzIDE4LjY4NzUgQyAyNC4xNTYyNSAxNi45MDYyNSAyNSAxNC45MTc5NjkgMjUgMTMgQyAyNSA4LjA0Mjk2OSAyMC45NTcwMzEgNCAxNiA0IFogTSAxNiA2IEMgMTkuODc4OTA2IDYgMjMgOS4xMjEwOTQgMjMgMTMgQyAyMyAxNC4zMDg1OTQgMjIuMzU1NDY5IDE2LjAzNTE1NiAyMS4zNDM3NSAxNy41OTM3NSBDIDIwLjQ0MTQwNiAxOC45ODQzNzUgMTkuMjUzOTA2IDIwLjIyMjY1NiAxOC4xNTYyNSAyMSBMIDEzLjg0Mzc1IDIxIEMgMTIuNzQ2MDk0IDIwLjIyMjY1NiAxMS41NTg1OTQgMTguOTg0Mzc1IDEwLjY1NjI1IDE3LjU5Mzc1IEMgOS42NDQ1MzEgMTYuMDM1MTU2IDkgMTQuMzA4NTk0IDkgMTMgQyA5IDkuMTIxMDk0IDEyLjEyMTA5NCA2IDE2IDYgWiBNIDE0LjI1IDIzIEwgMTcuNzUgMjMgQyAxNy44MjgxMjUgMjMuMDU0Njg4IDE3LjkxMDE1NiAyMy4wOTM3NSAxOCAyMy4xMjUgTCAxOCAyNSBMIDE0IDI1IEwgMTQgMjMuMTI1IEMgMTQuMDg5ODQ0IDIzLjA5Mzc1IDE0LjE3MTg3NSAyMy4wNTQ2ODggMTQuMjUgMjMgWiIvPjwvc3ZnPg==";
var symbols = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSAxMSA1IEwgMTEgMTEgTCA1IDExIEwgNSAxMyBMIDExIDEzIEwgMTEgMTkgTCA1IDE5IEwgNSAyMSBMIDExIDIxIEwgMTEgMjcgTCAxMyAyNyBMIDEzIDIxIEwgMTkgMjEgTCAxOSAyNyBMIDIxIDI3IEwgMjEgMjEgTCAyNyAyMSBMIDI3IDE5IEwgMjEgMTkgTCAyMSAxMyBMIDI3IDEzIEwgMjcgMTEgTCAyMSAxMSBMIDIxIDUgTCAxOSA1IEwgMTkgMTEgTCAxMyAxMSBMIDEzIDUgWiBNIDEzIDEzIEwgMTkgMTMgTCAxOSAxOSBMIDEzIDE5IFoiLz48L3N2Zz4=";
var flags = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSA5IDQgQyA3LjM0NiA0IDYgNS4zNDYgNiA3IEMgNiA4LjMwMTYwOTQgNi44Mzg3NDg2IDkuNDAyMTM5MSA4IDkuODE2NDA2MiBMIDggMTEuMzA0Njg4IEwgOCAyMy4yMDcwMzEgTCA4IDI3LjAyMzQzOCBDIDggMjcuNTYzNDM4IDguNDM2NTYyNSAyOCA4Ljk3NjU2MjUgMjggTCA5LjAyMzQzNzUgMjggQyA5LjU2MzQzNzUgMjggMTAgMjcuNTYzNDM3IDEwIDI3LjAyMzQzOCBMIDEwIDIyLjIyODUxNiBDIDEwLjMzNDcwNyAyMS44Mzk3NTYgMTEuMTM4NDIzIDIxLjA0Njg3NSAxMy40NDUzMTIgMjEuMDQ2ODc1IEMgMTQuNjY5MzEzIDIxLjA0Njg3NSAxNS42NzA0MjIgMjEuNDczNzgxIDE2LjczMjQyMiAyMS45MjU3ODEgQyAxNy43Njk0MjIgMjIuMzY3NzgxIDE4Ljg0MTg5MSAyMi44MjQyMTkgMjAuMDg3ODkxIDIyLjgyNDIxOSBDIDIyLjQ0Njg5MSAyMi44MjQyMTkgMjQuMDQ5Mzc1IDIxLjU4NDY4OCAyNC43MzQzNzUgMjEuMDU0Njg4IEwgMjQuODg2NzE5IDIwLjkzOTQ1MyBDIDI1LjQzNzcxOSAyMC41NDA0NTMgMjYgMTkuOTk2IDI2IDE5IEwgMjYgMTAuNjc1NzgxIEMgMjYgOS43Njc3ODEyIDI1LjIyMTgyOCA5IDI0LjI5ODgyOCA5IEMgMjMuODAzODI4IDkgMjMuNDQwNDA2IDkuMjg2NTkzNyAyMi45NDE0MDYgOS42ODM1OTM4IEMgMjIuMjc5NDA2IDEwLjIwNzU5NCAyMS4yODA4OTEgMTEgMjAuMDg3ODkxIDExIEMgMTkuMjcyODkxIDExIDE4LjQ3NzY4OCAxMC42MTk3MzQgMTcuNTU0Njg4IDEwLjE3NzczNCBDIDE2LjQwMzY4NyA5LjYyNTczNDQgMTUuMDk4MzU5IDkgMTMuNDQzMzU5IDkgQyAxMi4zMDgyNTcgOSAxMS40MjE2ODcgOS4xODgzMzkzIDEwLjcxMjg5MSA5LjQ1NzAzMTIgQyAxMS40ODkwNzEgOC45MTQxODI0IDEyIDguMDE2NzgwMiAxMiA3IEMgMTIgNS4zNDYgMTAuNjU0IDQgOSA0IHogTSA5IDYgQyA5LjU1MiA2IDEwIDYuNDQ5IDEwIDcgQyAxMCA3LjU1MSA5LjU1MiA4IDkgOCBDIDguNDQ4IDggOCA3LjU1MSA4IDcgQyA4IDYuNDQ5IDguNDQ4IDYgOSA2IHogTSAxMy40NDMzNTkgMTEgQyAxNC42NDUzNTkgMTEgMTUuNjM4NDA2IDExLjQ3NjQ2OSAxNi42OTE0MDYgMTEuOTgwNDY5IEMgMTcuNzM2NDA2IDEyLjQ4MjQ2OSAxOC44MTc4OTEgMTMgMjAuMDg3ODkxIDEzIEMgMjEuODQyODkxIDEzIDIzLjE1ODA0NyAxMi4wNTQ0ODQgMjMuOTk4MDQ3IDExLjM5NjQ4NCBMIDIzLjk5ODA0NyAxOS4wNjY0MDYgQyAyMy45OTcwNDcgMTkuMDcwNDA2IDIzLjk1Mjk4NCAxOS4xNDUyNjYgMjMuNzA4OTg0IDE5LjMyMjI2NiBMIDIzLjUwOTc2NiAxOS40NzQ2MDkgQyAyMi45NDI3NjYgMTkuOTEyNjA5IDIxLjc2Mjg5MSAyMC44MjQyMTkgMjAuMDg3ODkxIDIwLjgyNDIxOSBDIDE5LjI0OTg5MSAyMC44MjQyMTkgMTguNDQ2NjI1IDIwLjQ4MjkzNyAxNy41MTU2MjUgMjAuMDg1OTM4IEMgMTYuMzcyNjI1IDE5LjU5NzkzOCAxNS4wNzYzNTkgMTkuMDQ0OTIyIDEzLjQ0MzM1OSAxOS4wNDQ5MjIgQyAxMS44OTEzNTkgMTkuMDQ0OTIyIDEwLjc4NiAxOS4zNTggMTAgMTkuNzUgTCAxMCAxMi4zNjEzMjggQyAxMC4zNDUgMTEuOTA1MzI4IDExLjEzMjM1OSAxMSAxMy40NDMzNTkgMTEgeiIvPjwvc3ZnPg==";
var recent = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTSAxNiA0IEMgMTEuODMyMDMxIDQgOC4xNTIzNDQgNi4xMTMyODEgNiA5LjM0Mzc1IEwgNiA2IEwgNCA2IEwgNCAxMyBMIDExIDEzIEwgMTEgMTEgTCA3LjM3NSAxMSBDIDkuMTAxNTYzIDguMDE5NTMxIDEyLjI5Njg3NSA2IDE2IDYgQyAyMS41MzUxNTYgNiAyNiAxMC40NjQ4NDQgMjYgMTYgQyAyNiAyMS41MzUxNTYgMjEuNTM1MTU2IDI2IDE2IDI2IEMgMTAuNDY0ODQ0IDI2IDYgMjEuNTM1MTU2IDYgMTYgTCA0IDE2IEMgNCAyMi42MTcxODggOS4zODI4MTMgMjggMTYgMjggQyAyMi42MTcxODggMjggMjggMjIuNjE3MTg4IDI4IDE2IEMgMjggOS4zODI4MTMgMjIuNjE3MTg4IDQgMTYgNCBaIE0gMTUgOCBMIDE1IDE3IEwgMjIgMTcgTCAyMiAxNSBMIDE3IDE1IEwgMTcgOCBaIi8+PC9zdmc+Cg==";
const _sfc_main$3 = defineComponent({
  name: "Header",
  setup(props) {
    const { state, updateSearch, updateActiveGroup } = inject("store");
    const hasSearch = computed(() => !state.options.hideSearch);
    const hasGroupIcons = computed(() => !state.options.hideGroupIcons);
    const orderedKeys = JSON.parse(JSON.stringify(state.orderedGroupKeys));
    const placeholder = computed(
      () => state.options.staticTexts.placeholder || ""
    );
    const searchValue = computed({
      get: () => state.search,
      set: (value) => updateSearch(value)
    });
    const groups = [
      ...state.groups,
      ...Object.keys(state.options.additionalGroups).map((g) => ({
        key: g,
        title: state.options.groupNames[g] ? state.options.groupNames[g] : snakeToCapitalizedCase(g)
      }))
    ];
    const orderedGroups = [];
    orderedKeys.forEach((key) => {
      const index2 = groups.findIndex((group) => group.key === key);
      if (index2 === -1)
        return;
      orderedGroups.push(groups[index2]);
      groups.splice(index2, 1);
    });
    return {
      orderedGroups,
      orderedKeys,
      searchValue,
      updateActiveGroup,
      hasSearch,
      hasGroupIcons,
      placeholder,
      icons: {
        smileys_people,
        animals_nature,
        food_drink,
        activities,
        travel_places,
        objects,
        symbols,
        flags,
        ...state.options.groupIcons,
        recent
      }
    };
  }
});
const _hoisted_1$2 = {
  key: 0,
  class: "v3-header"
};
const _hoisted_2$2 = {
  key: 0,
  class: "v3-groups"
};
const _hoisted_3$2 = ["onClick"];
const _hoisted_4$2 = ["title"];
const _hoisted_5$2 = ["src"];
const _hoisted_6$1 = {
  key: 1,
  class: "v3-spacing"
};
const _hoisted_7 = {
  key: 2,
  class: "v3-search"
};
const _hoisted_8 = ["placeholder"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.hasGroupIcons || _ctx.hasSearch ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
    _ctx.hasGroupIcons ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.orderedGroups, (group) => {
        return openBlock(), createElementBlock("button", {
          key: group.key,
          type: "button",
          class: normalizeClass(["v3-group", {
            "v3-is-hidden": !_ctx.icons[group.key]
          }]),
          onClick: ($event) => _ctx.updateActiveGroup(group.key)
        }, [
          createElementVNode("span", {
            title: group.title,
            class: "v3-icon"
          }, [
            createElementVNode("img", {
              src: _ctx.icons[group.key],
              alt: ""
            }, null, 8, _hoisted_5$2)
          ], 8, _hoisted_4$2)
        ], 10, _hoisted_3$2);
      }), 128))
    ])) : createCommentVNode("", true),
    _ctx.hasGroupIcons && _ctx.hasSearch ? (openBlock(), createElementBlock("div", _hoisted_6$1)) : createCommentVNode("", true),
    _ctx.hasSearch ? (openBlock(), createElementBlock("div", _hoisted_7, [
      withDirectives(createElementVNode("input", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.searchValue = $event),
        type: "text",
        placeholder: _ctx.placeholder
      }, null, 8, _hoisted_8), [
        [vModelText, _ctx.searchValue]
      ])
    ])) : createCommentVNode("", true)
  ])) : createCommentVNode("", true);
}
var Header = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = defineComponent({
  name: "Header",
  setup() {
    const { state, updateSkinTone } = inject("store");
    const skinTone = ref(false);
    const hasError = ref(false);
    const stateSkinTone = computed(() => state.skinTone);
    const skinToneText = computed(
      () => state.options.staticTexts.skinTone || "Skin tone"
    );
    const hasSkinTones = computed(() => !state.options.disableSkinTones);
    const platform = isMac() ? "is-mac" : "";
    const emoji = computed(() => {
      return {
        ...state.emoji,
        src: EMOJI_REMOTE_SRC + "/" + state.emoji[EMOJI_RESULT_KEY] + ".png"
      };
    });
    function updateSkinToneState(open = true) {
      skinTone.value = open;
    }
    function toggleSkinToneState() {
      skinTone.value = !skinTone.value;
    }
    function selectSkinTone(tone) {
      updateSkinTone(tone);
      updateSkinToneState(false);
    }
    watch(
      () => state.emoji,
      () => {
        hasError.value = false;
      }
    );
    return {
      emoji,
      SKIN_TONES,
      updateSkinToneState,
      skinTone,
      stateSkinTone,
      selectSkinTone,
      toggleSkinToneState,
      EMOJI_RESULT_KEY,
      EMOJI_NAME_KEY,
      skinToneText,
      hasSkinTones,
      native: state.options.native,
      unicodeToEmoji,
      platform,
      hasError
    };
  }
});
const _hoisted_1$1 = { class: "v3-foot-left" };
const _hoisted_2$1 = { key: 0 };
const _hoisted_3$1 = ["alt", "src"];
const _hoisted_4$1 = { class: "v3-text" };
const _hoisted_5$1 = { class: "v3-text" };
const _hoisted_6 = ["onClick"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "v3-footer",
    onMouseleave: _cache[2] || (_cache[2] = ($event) => _ctx.updateSkinToneState(false))
  }, [
    createElementVNode("div", _hoisted_1$1, [
      createElementVNode("span", {
        class: normalizeClass([_ctx.platform, "v3-icon"])
      }, [
        _ctx.native || _ctx.hasError ? (openBlock(), createElementBlock("span", _hoisted_2$1, toDisplayString(_ctx.unicodeToEmoji(_ctx.emoji.r)), 1)) : (openBlock(), createElementBlock("img", {
          key: 1,
          alt: _ctx.unicodeToEmoji(_ctx.emoji.r),
          src: _ctx.emoji.src,
          onError: _cache[0] || (_cache[0] = ($event) => _ctx.hasError = true)
        }, null, 40, _hoisted_3$1))
      ], 2),
      createElementVNode("span", _hoisted_4$1, " :" + toDisplayString(_ctx.emoji[_ctx.EMOJI_NAME_KEY][1] || _ctx.emoji[_ctx.EMOJI_NAME_KEY][0]) + ": ", 1)
    ]),
    _ctx.hasSkinTones ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      createElementVNode("button", {
        type: "button",
        class: "v3-tone",
        onClick: _cache[1] || (_cache[1] = (...args) => _ctx.toggleSkinToneState && _ctx.toggleSkinToneState(...args))
      }, [
        createElementVNode("span", _hoisted_5$1, toDisplayString(_ctx.skinToneText), 1),
        createElementVNode("span", {
          class: normalizeClass(`v3-icon v3-tone-${_ctx.stateSkinTone}`)
        }, null, 2)
      ]),
      createElementVNode("div", {
        class: normalizeClass([_ctx.skinTone ? "v3-is-open" : "", "v3-skin-tones"])
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.SKIN_TONES, (tone) => {
          return openBlock(), createElementBlock("button", {
            key: tone,
            type: "button",
            class: normalizeClass(["v3-skin-tone-" + tone, "v3-skin-tone"]),
            onClick: ($event) => _ctx.selectSkinTone(tone)
          }, null, 10, _hoisted_6);
        }), 128))
      ], 2)
    ], 64)) : createCommentVNode("", true)
  ], 32);
}
var Footer = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = defineComponent({
  name: "PickerRoot",
  components: {
    Header,
    Body,
    Footer
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    additionalGroups: {
      type: Object,
      default: () => ({})
    },
    groupOrder: {
      type: Array,
      default: () => []
    },
    groupIcons: {
      type: Object,
      default: () => ({})
    },
    groupNames: {
      type: Object,
      default: () => ({})
    }
  },
  emits: {
    select: (emoji) => true,
    "update:text": (value) => true
  },
  setup(props, { emit }) {
    const elem = ref();
    const button = ref();
    const picker = ref();
    const open = ref(false);
    const input = ref(props.text);
    const isInputType = props.type === "input" || props.type === "textarea";
    let cursor = -1;
    const { state } = inject("store");
    const colorTheme = computed(() => state.options.colorTheme);
    function onSelect(emoji) {
      if (isInputType) {
        const mode = state.options.mode;
        if (mode === "prepend") {
          input.value = emoji.i + input.value;
        } else if (mode === "insert" && cursor !== -1) {
          input.value = `${input.value.slice(0, cursor)}${emoji.i}${input.value.slice(cursor)}`;
          cursor += emoji.i.length;
        } else {
          input.value += emoji.i;
        }
        emit("update:text", input.value);
      }
      emit("select", emoji);
    }
    function updateCursor() {
      var _a;
      if (elem.value) {
        cursor = ((_a = elem.value) == null ? void 0 : _a.selectionEnd) || -1;
      }
    }
    function clickListener(event) {
      var _a;
      const isOutside = !((_a = event.target) == null ? void 0 : _a.closest(
        ".v3-input-picker-wrap"
      ));
      if (isOutside && open.value) {
        open.value = false;
      }
    }
    function setupPopper() {
      if (button.value && picker.value && isInputType) {
        let offset2 = state.options.offset;
        if (typeof offset2 !== "number") {
          offset2 = 6;
        }
        createPopper(button.value, picker.value, {
          placement: "bottom-end",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, offset2]
              }
            }
          ]
        });
        document.body.addEventListener("click", clickListener);
      }
    }
    function onChangeText(event) {
      input.value = event.target.value || "";
      emit("update:text", input.value);
    }
    onMounted(() => {
      setupPopper();
    });
    onBeforeUnmount(() => {
      document.body.removeEventListener("click", clickListener);
    });
    return {
      face: smileys_people,
      open,
      onSelect,
      input,
      elem,
      updateCursor,
      button,
      picker,
      isInputType,
      onChangeText,
      colorTheme
    };
  }
});
const _hoisted_1 = {
  key: 0,
  class: "v3-input-emoji-picker"
};
const _hoisted_2 = { class: "v3-input-picker-root" };
const _hoisted_3 = ["value"];
const _hoisted_4 = ["value"];
const _hoisted_5 = ["src"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Header = resolveComponent("Header");
  const _component_Body = resolveComponent("Body");
  const _component_Footer = resolveComponent("Footer");
  return _ctx.isInputType ? (openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      _ctx.type === "input" ? (openBlock(), createElementBlock("input", {
        key: 0,
        ref: "elem",
        value: _ctx.input,
        type: "text",
        class: "v3-emoji-picker-input",
        onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onChangeText && _ctx.onChangeText(...args)),
        onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.updateCursor && _ctx.updateCursor(...args))
      }, null, 40, _hoisted_3)) : (openBlock(), createElementBlock("textarea", {
        key: 1,
        ref: "elem",
        value: _ctx.input,
        class: "v3-emoji-picker-textarea",
        onInput: _cache[2] || (_cache[2] = (...args) => _ctx.onChangeText && _ctx.onChangeText(...args)),
        onBlur: _cache[3] || (_cache[3] = (...args) => _ctx.updateCursor && _ctx.updateCursor(...args))
      }, null, 40, _hoisted_4)),
      createElementVNode("div", {
        class: normalizeClass(["v3-input-picker-wrap", _ctx.open ? "v3-picker-is-open" : ""])
      }, [
        createElementVNode("button", {
          ref: "button",
          type: "button",
          class: "v3-input-picker-icon",
          onClick: _cache[4] || (_cache[4] = ($event) => _ctx.open = !_ctx.open)
        }, [
          createElementVNode("img", {
            src: _ctx.face,
            alt: ""
          }, null, 8, _hoisted_5)
        ], 512),
        createElementVNode("div", {
          ref: "picker",
          class: normalizeClass(["v3-emoji-picker", "v3-color-theme-" + _ctx.colorTheme])
        }, [
          createVNode(_component_Header),
          createVNode(_component_Body, { onSelect: _ctx.onSelect }, null, 8, ["onSelect"]),
          createVNode(_component_Footer)
        ], 2)
      ], 2)
    ])
  ])) : (openBlock(), createElementBlock("div", {
    key: 1,
    class: normalizeClass(["v3-emoji-picker", "v3-color-theme-" + _ctx.colorTheme])
  }, [
    createVNode(_component_Header),
    createVNode(_component_Body, { onSelect: _ctx.onSelect }, null, 8, ["onSelect"]),
    createVNode(_component_Footer)
  ], 2));
}
var PickerRoot = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = defineComponent({
  name: "Picker",
  components: {
    PickerRoot
  },
  props: {
    native: {
      type: Boolean,
      default: false
    },
    hideSearch: {
      type: Boolean,
      default: false
    },
    hideGroupIcons: {
      type: Boolean,
      default: false
    },
    hideGroupNames: {
      type: Boolean,
      default: false
    },
    staticTexts: {
      type: Object,
      default: () => ({})
    },
    disableStickyGroupNames: {
      type: Boolean,
      default: false
    },
    disabledGroups: {
      type: Array,
      default: () => []
    },
    groupNames: {
      type: Object,
      default: () => ({})
    },
    disableSkinTones: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: "insert"
    },
    offset: {
      type: Number,
      default: 6
    },
    additionalGroups: {
      type: Object,
      default: () => ({})
    },
    groupOrder: {
      type: Array,
      default: () => []
    },
    groupIcons: {
      type: Object,
      default: () => ({})
    },
    pickerType: {
      type: String,
      default: ""
    },
    displayRecent: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: "light"
    }
  },
  emits: {
    "update:text": (text) => true,
    select: (emoji) => true
  },
  setup(props, { emit }) {
    const input = ref(props.text);
    function onChangeText(text) {
      input.value = text || "";
      emit("update:text", input.value);
    }
    const store = Store();
    store.updateOptions({
      native: props.native,
      hideSearch: props.hideSearch,
      hideGroupIcons: props.hideGroupIcons,
      hideGroupNames: props.hideGroupNames,
      staticTexts: { ...STATIC_TEXTS, ...props.staticTexts },
      disableStickyGroupNames: props.disableStickyGroupNames,
      disabledGroups: props.disabledGroups,
      groupNames: { ...GROUP_NAMES, ...props.groupNames },
      disableSkinTones: props.disableSkinTones,
      displayRecent: props.displayRecent,
      additionalGroups: props.additionalGroups,
      mode: props.mode,
      offset: props.offset,
      groupOrder: props.groupOrder,
      groupIcons: props.groupIcons,
      colorTheme: COLOR_THEMES.includes(props.theme) ? props.theme : "light"
    });
    provide("store", store);
    return {
      type: props.pickerType,
      input,
      onChangeText
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_picker_root = resolveComponent("picker-root");
  return openBlock(), createBlock(_component_picker_root, {
    type: _ctx.type,
    text: _ctx.input,
    onSelect: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("select", $event)),
    "onUpdate:text": _ctx.onChangeText
  }, null, 8, ["type", "text", "onUpdate:text"]);
}
var Picker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
var index = "";
export { Picker as default };
