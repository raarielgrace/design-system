import { useState, useEffect } from "react";
import { Time } from '@internationalized/date';
import { Button, Header, Loader, TimeField } from "./components";
import "./SuperCoolDemo.css";
import SvgMoon from "./components/Icons/DemoIcons/SvgMoon";
import SvgSun from "./components/Icons/DemoIcons/SvgSun";
import { useToastQueue } from "./components/Toast";

export default function SuperCoolDemo() {
  const queue = useToastQueue();

  // Fake load conditions
  const [startPressed, setStartPressed] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(false);
  const [secondLoad, setSecondLoad] = useState<boolean>(false);
  const [thirdLoad, setThirdLoad] = useState<boolean>(false);
  const [thirdLoadVal, setThirdLoadVal] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Light and dark mode
  const [theme, setTheme] = useState<"light"|"dark">("light");
  const [timeValue, setTimeValue] = useState<Time | null>(null);

  const determinateLoad = async () => {
    // Stateful variables don't update during function run, hacky solution
    let counter = thirdLoadVal;
    while(counter < 100) {
      await new Promise(r => setTimeout(r, 100));
      counter += 1;
      setThirdLoadVal((p) => p + 1);
    }
  };

  const load = async () => {
    setFirstLoad(true);
    await new Promise(r => setTimeout(r, 5500));
    setFirstLoad(false);
    await new Promise(r => setTimeout(r, 500));
    queue.add({
      message: "More loading required.",
      variant: "error",
    });
    await new Promise(r => setTimeout(r, 500));
    setSecondLoad(true);
    await new Promise(r => setTimeout(r, 3000));
    setSecondLoad(false);
    await new Promise(r => setTimeout(r, 250));
    queue.add({
      message: "¯\\_(ツ)_/¯",
      variant: "error",
    });
    await new Promise(r => setTimeout(r, 500));
    setThirdLoad(true);
    await determinateLoad();
    setThirdLoad(false);
    setLoaded(true);
  };

  useEffect(() => {
    if (timeValue === null) return;
    if (timeValue.hour >= 8 && timeValue.hour < 17) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [timeValue]);

  return (
    <div className="root">
      <Header title="Design System's Rad Demo" />
      <div className={`panel ${theme}`}>
        {!loaded && (
          <div id="theme-switch" className={theme}>
            <button onClick={() => {
              if (theme === "light") {
                setTheme("dark");
              } else {
                setTheme("light");
              }}}
            >
              {theme === "light" ? <SvgMoon /> : <SvgSun />}
              <TimeField value={timeValue} onChange={(v) => setTimeValue(v)} />
            </button>
          </div>
        )}
        {!startPressed && (
          <Button
            id="start-button"
            variant={theme === "light" ? "primary" : "secondary"}
            onClick={() => {
              setStartPressed(true);
              load();
            }}>
              Start
          </Button>
        )}
        {firstLoad && (
          <Loader label="Initiating surprise..." isIndeterminate size="large" theme={theme}/>
        )}
        {secondLoad && (
          <Loader label="Whoops, a little longer..." isIndeterminate size="small" theme={theme}/>
        )}
        {thirdLoad && (
          <Loader value={thirdLoadVal} label="Ok, now we've got it..." theme={theme}/>
        )}
        {loaded && (
          <div id="cake">
           <pre>            ,:/+/-
            /M/              .,-=;//;-
       .:/= ;MH/,    ,=/+%$XH@MM#@:
      -$##@+$###@H@MMM#######H:.    -/H#
 .,H@H@ X######@ -H#####@+-     -+H###@X
  .,@##H;      +XM##M/,     =%@###@X;-
X%-  :M##########$.    .:%M###@%:
M##H,   +H@@@$/-.  ,;$M###@%,          -
M####M=,,---,.-%%H####M$:          ,+@##
@##################@/.         :%H##@$-
M###############H,         ;HM##M$=
#################.    .=$M##M$=
################H..;XM##M$=          .:+
M###################@%=           =+@MH%
@#################M/.         =+H#X%=
=+M###############M,      ,/X#H+:,
  .;XM###########H=   ,/X#H+:;
     .=+HM#######M+/+HM@+=.
         ,:/%XM####H/.
              ,.:=-.
</pre>
          </div>
        )}
      </div>
    </div>
  );
}