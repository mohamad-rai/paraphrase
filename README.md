# Text Spinner

If you only need to rewrite a few articles, then this may be the option for you. If you just want to paraphrase a simple sentence or phrase, this option would make sense as well. Sometimes, you just need to find out quickly what something means in the surrounding context. This tool will be useful!

## How to use

To spin your text, you have to send a json to `{{host}}/v1/spin` and `?cap=false` to disable captcha:

```json
{
  "captcha": "",
  "data": {
    "element": "blaze",
    "percent": 1,
    "type": 0,
    "ignore": ["various", "or", "anything"],
    "text": "There are various levels for CoinEx VIP members and depending on your VIP level, you will enjoy different fees discounts."
  }
}
```
- **captcha:** captcha token
- **data:**
  - **element:** blaze (default and only option for now)
  - **percent:** percentage of paraphrasing
  - **type:** 0 (default and only option for now)
  - **ignore:** array of words that you don't want to paraphrase
  - **text:** your text 

## Response

```json
{
  "spun": {
    "difference": [
      {
        "count": 4,
        "value": "There are "
      },
      {
        "count": 1,
        "removed": true,
        "value": "various"
      },
      {
        "count": 1,
        "added": true,
        "value": "different"
      },
      {
        "count": 9,
        "value": " levels for CoinEx VIP "
      },
      {
        "count": 1,
        "removed": true,
        "value": "members"
      },
      {
        "count": 1,
        "added": true,
        "value": "individuals"
      },
      {
        "count": 3,
        "value": " and "
      },
      {
        "count": 1,
        "removed": true,
        "value": "depending"
      },
      {
        "count": 1,
        "added": true,
        "value": "relying"
      },
      {
        "count": 1,
        "value": " "
      },
      {
        "count": 1,
        "removed": true,
        "value": "on"
      },
      {
        "count": 1,
        "added": true,
        "value": "upon"
      },
      {
        "count": 12,
        "value": " your VIP level, you will "
      },
      {
        "count": 1,
        "removed": true,
        "value": "enjoy"
      },
      {
        "count": 1,
        "added": true,
        "value": "appreciate"
      },
      {
        "count": 1,
        "value": " "
      },
      {
        "count": 1,
        "removed": true,
        "value": "different"
      },
      {
        "count": 1,
        "added": true,
        "value": "various"
      },
      {
        "count": 1,
        "value": " "
      },
      {
        "count": 1,
        "removed": true,
        "value": "fees"
      },
      {
        "count": 1,
        "added": true,
        "value": "expenses"
      },
      {
        "count": 1,
        "value": " "
      },
      {
        "count": 1,
        "removed": true,
        "value": "discounts"
      }
    ],
    "highlightText": ["There are  <span class=\"spun-word cursor-pointer\">different</span> levels for CoinEx VIP  <span class=\"spun-word cursor-pointer\">individuals</span> and  <span class=\"spun-word cursor-pointer\">relying</span>  <span class=\"spun-word cursor-pointer\">upon</span> your VIP level, you will  <span class=\"spun-word cursor-pointer\">appreciate</span>  <span class=\"spun-word cursor-pointer\">various</span>  <span class=\"spun-word cursor-pointer\">expenses</span>  <span class=\"spun-word cursor-pointer\">limits</span>."]
  }
}
```

- **spun:**
  - **difference:** array of difference words (old and spun)
    - **count**: number of words in this part (split by space)
    - **value:** word(s) changed
    - **removed:** if value is removed from text this will be true
    - **added:** if value removed, new word will be replaced with that and this option will be true
  - **highlightText:** array of paragraph
    - **each item:** a paragraph of paraphrased text with a ```<span class="spun-word"></span>``` on each changed word

