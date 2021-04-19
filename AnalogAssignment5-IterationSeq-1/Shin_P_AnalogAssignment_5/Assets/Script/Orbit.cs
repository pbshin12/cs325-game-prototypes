using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Orbit : MonoBehaviour
{
    public GameObject boss;
    public float speed;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        OrbitAround();
    }

    /*https://www.youtube.com/watch?v=3PHc6vEckvc */
    void OrbitAround()
    {
        transform.RotateAround(boss.transform.position, Vector3.forward, speed * Time.deltaTime);
    }
}
