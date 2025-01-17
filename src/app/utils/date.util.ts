import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/fr";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);

export default dayjs;
