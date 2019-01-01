using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static System.Console;
using System.IO;
class Program {
  public static void Main (string[] args) {
  SaverLoader sl=new SaverLoader();
  string[] rules=sl.LoadGame();
  WriteLine("Ready?");
  ReadLine();
  int counter=0;
  while(true){
  counter=0;
  while(true){
    WriteLine(rules[counter]);
    counter++;
    if(counter==21){break;}
    string response = ReadLine();
    if(response==rules[counter]){
      counter++;
    } else {
      WriteLine("You Lose!");
      counter=0;
      }
    }
 Rand randy=new Rand();
 WriteLine("Please wait, generating new random rule...");
  int r = randy.RandRule();
  Thread.Sleep(2000);
  int q=randy.RandRule();
  rules[q]=r.ToString();
  WriteLine("{0} is now replaced with {1}!",q+1,r);
  counter=0;
  WriteLine("Start Please!");
  Thread.Sleep(2000);
  while(true){
    if(counter>=21){break;}
    string response = ReadLine();
    if(response==rules[counter]){
      counter++;
      if(counter>=21){}else{
      WriteLine(rules[counter]);
      counter++;}
    } else {
      WriteLine("You Lose!");
      counter=0;
      }
    }
    WriteLine("Continue? (Y/N)");
  if(ReadLine()=="N"){
    sl.saveGame(rules,counter);
    break;
  }else{
    WriteLine("Please enter a number (0-21) to replace:");
    int v = Convert.ToInt32(ReadLine());
    WriteLine("Please enter the replacement:");
    string a = ReadLine();
    try{
      rules[v-1]=a;
    }catch(Exception e){
      WriteLine(e);
      WriteLine("Please enter a number (0-21) to replace:");
    v = Convert.ToInt32(ReadLine());
    WriteLine("Please enter the replacement:");
    a = ReadLine();
    rules[v-1]=a;
    }
  }
  }
  }
  
}
class SaverLoader{
  private string path;
  private string ans;
  public string timeSaved;
  public string name;
  public string[] LoadGame(){
    WriteLine("Start new game or load saved game?(new/continue)");
    string r=ReadLine();
    string[] rules=new string[21];
    if(r=="continue"){
      do{
        Write("\nPlease enter the path to your saved game:");
        path=ReadLine();
        Write("\nYou have entered {0}. Is this correct? (Y/N)",path);
        ans=ReadLine();
      }while(ans!="Y"||File.Exists(path)==false);
      StreamReader sr = new StreamReader(path);
      timeSaved=sr.ReadLine();
      name=sr.ReadLine();
      WriteLine("Loading game {0}, saved at {1}...", name,timeSaved);
      for(var i=0;sr.EndOfStream!=true;i++){
        rules[i]=sr.ReadLine();
      }
    } else {
      rules[0]="1";
      rules[1]="2";
      rules[2]="3";
      rules[3]="4";
      rules[4]="5";
      rules[5]="6";
      rules[6]="14";
      rules[7]="8";
      rules[8]="9";
      rules[9]="10";
      rules[10]="11";
      rules[11]="12";
      rules[12]="13";
      rules[13]="7";
      rules[14]="15";
      rules[15]="16";
      rules[16]="17";
      rules[17]="18";
      rules[18]="19";
      rules[19]="20";
      rules[20]="21";
    }
    return rules;
  }
  public void saveGame(string[] rules, int counter){
    WriteLine("Please enter a name for this save file:");
    path=ReadLine();
    StreamWriter sw = new StreamWriter(path+".21save",false);
    DateTime now= DateTime.Now;
    sw.WriteLine(now.ToString());
    sw.WriteLine(path);
    foreach(string s in rules){
      sw.WriteLine(s);
    }
    sw.Close();
  }
}
class Rand{
  public int RandRule(){
    Random rand = new Random();
    byte[] values= new byte[1];
    do{
    values[0]=0;
    rand.NextBytes(values);
    }while((int)values[0]<0||(int)values[0]>20);
    return (int)values[0];
  }
}